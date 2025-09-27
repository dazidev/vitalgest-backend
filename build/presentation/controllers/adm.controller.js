"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmController = void 0;
const domain_1 = require("../../domain");
const application_1 = require("../../application");
const infrastructure_1 = require("../../infrastructure");
class AdmController {
    constructor(admService) {
        this.admService = admService;
        this.handleError = (error) => {
            if (error.code === domain_1.ERROR_CODES.UNKNOWN_ERROR)
                return application_1.CustomError.internalServer(error.code);
            if (error.code === domain_1.ERROR_CODES.TOO_MANY_REQUESTS)
                return application_1.CustomError.tooManyRequests(error.code);
            return application_1.CustomError.badRequest(error.code);
        };
    }
    createUser(req, res, next) {
        const [error, userEntityDto] = application_1.UserEntityDto.create(req.body);
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.admService.createUser(userEntityDto)
            .then((user) => res.status(201).json(user))
            .catch((error) => next(this.handleError(error)));
    }
    editUser(req, res, next) {
        const { id } = req.params;
        const [error, userEntityDto] = application_1.UserEntityDto.edit({ id, ...req.body });
        if (error)
            throw application_1.CustomError.badRequest(error);
        this.admService.editUser(userEntityDto)
            .then((user) => res.status(200).json(user))
            .catch((error) => next(this.handleError(error)));
    }
    deleteUser(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_USER_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_USER_ID);
        this.admService.deleteUser(id)
            .then((user) => res.status(200).json(user))
            .catch((error) => next(this.handleError(error)));
    }
    getAllUsers(req, res, next) {
        const { amount } = req.params;
        if (!amount)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_AMOUNT);
        const n = Number(amount);
        if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.AMOUNT_NOT_NUMBER);
        }
        const validateAmount = Math.min(n, 50);
        this.admService.getAllUsers(validateAmount)
            .then((user) => res.status(200).json(user))
            .catch((error) => next(this.handleError(error)));
    }
    changePasswordUser(req, res, next) {
        const { id } = req.params;
        const { password } = req.body;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_USER_ID);
        if (!password)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_PASSWORD);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_USER_ID);
        if (!infrastructure_1.regularExp.password.test(password))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_PASSWORD_FORMAT);
        this.admService.changePasswordUser(id, password)
            .then((user) => res.status(200).json(user))
            .catch((error) => next(this.handleError(error)));
    }
    getUserById(req, res, next) {
        const { id } = req.params;
        if (!id)
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.MISSING_USER_ID);
        if (!infrastructure_1.regularExp.uuid.test(id))
            throw application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_USER_ID);
        this.admService.getUserById(id)
            .then((response) => res.status(200).json(response))
            .catch((error) => next(this.handleError(error)));
    }
}
exports.AdmController = AdmController;
