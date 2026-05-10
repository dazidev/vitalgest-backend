"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const dotenv_1 = require("dotenv");
const cloudflare_r2_service_1 = require("../../infrastructure/services/cloudflare-r2.service");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
(0, dotenv_1.config)();
// R2 declarations
const BUCKET = process.env.R2_BUCKET;
const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 5000000);
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.handleError = (error) => {
            if (error === domain_1.ERROR_CODES.UNKNOWN_ERROR)
                return application_1.CustomError.internalServer(error);
            if (error === domain_1.ERROR_CODES.UNKNOWN_DB_ERROR)
                return application_1.CustomError.internalServer(error);
            if (error === domain_1.ERROR_CODES.TOO_MANY_REQUESTS)
                return application_1.CustomError.tooManyRequests(error);
            return application_1.CustomError.badRequest(error);
        };
        this.uploadSign = async (req, res, next) => {
            const { id } = req.params;
            const { mime, ext, size } = req.body;
            //validaciones
            const allow = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            if (!allow.includes(mime))
                return application_1.CustomError.badRequest("INVALID_MIME");
            if (!ext || ext.length > 8)
                return application_1.CustomError.badRequest("INVALID_EXT");
            if (!size || size > MAX_BYTES)
                return application_1.CustomError.badRequest("INVALID_SIZE");
            const key = `users/signatures/images/${id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
            const cmd = new client_s3_1.PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                ContentType: mime,
                // Opcional: limitar tamaño esperado
                // ContentLength: size,
            });
            return (0, s3_request_presigner_1.getSignedUrl)(cloudflare_r2_service_1.r2, cmd, { expiresIn: 600 })
                .then((uploadUrl) => {
                const payload = {
                    success: true,
                    data: {
                        uploadUrl,
                        key,
                    },
                };
                return res.json(payload);
            })
                .catch((error) => next(application_1.CustomError.badRequest(error)));
        };
        this.attachSignatureImage = async (req, res, next) => {
            const { id } = req.params;
            const { key } = req.body;
            if (!id)
                throw this.handleError(domain_1.ERROR_CODES.MISSING_USER_ID);
            if (!key)
                throw this.handleError(domain_1.ERROR_CODES.MISSING_KEY);
            cloudflare_r2_service_1.r2.send(new client_s3_1.HeadObjectCommand({ Bucket: BUCKET, Key: key })).catch(() => next(application_1.CustomError.badRequest("OBJECT_NOT_FOUND")));
            this.userService
                .attachSignatureImage(id, key)
                .then((response) => res.json(response))
                .catch((error) => next(application_1.CustomError.badRequest(error)));
        };
    }
    changePassword(req, res, next) {
        const { id } = req.params;
        const { currentPass, newPass } = req.body;
        const [error, _userEntityDto] = application_1.UserEntityDto.changePassword({
            id,
            ...req.body,
        });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.userService
            .changePassword(id, currentPass, newPass)
            .then((user) => res.status(200).json(user))
            .catch((error) => next(this.handleError(error)));
    }
    changeInfo(req, res, next) {
        const { id } = req.params;
        const { name, lastname } = req.body;
        const [error, _userEntityDto] = application_1.UserEntityDto.changeInfo({
            id,
            name,
            lastname,
        });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.userService
            .changeInfo(id, name, lastname)
            .then((user) => res.status(200).json(user))
            .catch((error) => next(this.handleError(error)));
    }
}
exports.UserController = UserController;
