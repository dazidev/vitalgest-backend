"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { AuthMiddleware, RankMiddleware } from '../../infrastructure';
const delegations_controller_1 = require("../controllers/delegations.controller");
const delegations_service_1 = require("../services/delegations.service");
const delegationsRoutes = express_1.default.Router();
const service = new delegations_service_1.DelegationsService();
const controller = new delegations_controller_1.DelegationsController(service);
delegationsRoutes.get('/states', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.getStates.bind(controller));
delegationsRoutes.get('/state/:stateId/municipalities', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.getMunicipalities.bind(controller));
delegationsRoutes.post('/create', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.createDelegation.bind(controller));
delegationsRoutes.put('/edit/:id', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.editDelegation.bind(controller));
delegationsRoutes.delete('/delete/:id', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.deleteDelegation.bind(controller));
delegationsRoutes.get('/many/:amount', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.getDelegations.bind(controller));
delegationsRoutes.get('/one/:id', 
//[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
controller.getDelegation.bind(controller));
exports.default = delegationsRoutes;
