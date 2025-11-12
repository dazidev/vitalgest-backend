"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adm_controller_1 = require("../controllers/adm.controller");
const adm_service_1 = require("../services/adm.service");
const infrastructure_1 = require("../../infrastructure");
const admRoutes = express_1.default.Router();
const admService = new adm_service_1.AdmService();
const controller = new adm_controller_1.AdmController(admService);
admRoutes.post('/create/user', [infrastructure_1.AuthMiddleware.validateJWT, infrastructure_1.RankMiddleware.validate('admin')], controller.createUser.bind(controller));
admRoutes.put('/edit/user/:id', [infrastructure_1.AuthMiddleware.validateJWT, infrastructure_1.RankMiddleware.validate('admin')], controller.editUser.bind(controller));
admRoutes.delete('/delete/user/:id', [infrastructure_1.AuthMiddleware.validateJWT, infrastructure_1.RankMiddleware.validate('admin')], controller.deleteUser.bind(controller));
admRoutes.get('/get-all/users/:amount', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin', true)],
controller.getAllUsers.bind(controller));
admRoutes.put('/change-password/user/:id', [infrastructure_1.AuthMiddleware.validateJWT, infrastructure_1.RankMiddleware.validate('admin')], controller.changePasswordUser.bind(controller));
admRoutes.get('/get/user/:id', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.getUserById.bind(controller));
exports.default = admRoutes;
