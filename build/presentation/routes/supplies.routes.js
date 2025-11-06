"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplies_service_1 = require("../services/supplies.service");
const supplies_controller_1 = require("../controllers/supplies.controller");
const suppliesRoutes = express_1.default.Router();
const suppliesService = new supplies_service_1.SuppliesService();
const controller = new supplies_controller_1.SuppliesController(suppliesService);
suppliesRoutes.post('/create/pharmacy/:id', controller.createSupply.bind(controller));
suppliesRoutes.put('/edit/:id', controller.editSupply.bind(controller));
suppliesRoutes.delete('/delete/:id', controller.deleteSupply.bind(controller));
suppliesRoutes.get('/pharmacy/:id', controller.getSupplies.bind(controller));
suppliesRoutes.get('/one/:id', controller.getOneSupply.bind(controller));
exports.default = suppliesRoutes;
