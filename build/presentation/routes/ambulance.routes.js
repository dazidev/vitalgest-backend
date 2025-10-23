"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ambulance_service_1 = require("../services/ambulance.service");
const ambulances_controller_1 = require("../controllers/ambulances.controller");
const AmbulanceRoutes = express_1.default.Router();
const ambulanceService = new ambulance_service_1.AmbulancesService();
const controller = new ambulances_controller_1.AmbulancesController(ambulanceService);
AmbulanceRoutes.post('/create', controller.createAmbulance.bind(controller));
AmbulanceRoutes.put('/edit/:id', controller.editAmbulance.bind(controller));
AmbulanceRoutes.delete('/delete/:id', controller.deleteAmbulance.bind(controller));
AmbulanceRoutes.get('/many/:amount', controller.getAmbulances.bind(controller));
AmbulanceRoutes.get('/one/:id', controller.getOneAmbulance.bind(controller));
exports.default = AmbulanceRoutes;
