"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const infrastructure_1 = require("../../../infrastructure");
const application_1 = require("../../../application");
const domain_1 = require("../../../domain");
const devRoutes = express_1.default.Router();
devRoutes.post('/seed/sm', [infrastructure_1.AuthMiddleware.validateJWT, infrastructure_1.RankMiddleware.validate('admin')], async (_req, res, next) => {
    try {
        const seed = await (0, infrastructure_1.createSMSeed)();
        if (!seed)
            return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.INSERT_FAILED));
        return res.status(201).json(seed);
    }
    catch (error) {
        return next(application_1.CustomError.badRequest(domain_1.ERROR_CODES.UNKNOWN_DB_ERROR));
    }
});
//devRoutes.post('/refresh/token',);
exports.default = devRoutes;
