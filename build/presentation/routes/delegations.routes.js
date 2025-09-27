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
exports.default = delegationsRoutes;
