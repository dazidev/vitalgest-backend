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
admRoutes.put('/edit/user/:id', controller.editUser.bind(controller));
admRoutes.delete('/delete/user/:id', controller.deleteUser.bind(controller));
admRoutes.get('/get-all/users/:amount', controller.getAllUsers.bind(controller));
admRoutes.put('/change-password/user/:id', controller.changePasswordUser.bind(controller));
exports.default = admRoutes;
