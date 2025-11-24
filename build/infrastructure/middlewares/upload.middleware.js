"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checklistSignFiles = exports.checklistGasFile = exports.upload = exports.ALLOWED_MIME = void 0;
const multer_1 = __importDefault(require("multer"));
const application_1 = require("../../application");
const domain_1 = require("../../domain");
exports.ALLOWED_MIME = new Set([
    "image/jpeg",
    "image/png",
    "application/pdf",
]);
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (!exports.ALLOWED_MIME.has(file.mimetype)) {
            return cb(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INVALID_FILES_TYPE));
        }
        cb(null, true);
    },
});
exports.checklistGasFile = exports.upload.fields([
    { name: "gasFile", maxCount: 1 },
]);
exports.checklistSignFiles = exports.upload.fields([
    { name: "signOperatorFile", maxCount: 1 },
    { name: "signRecipientFile", maxCount: 1 },
]);
