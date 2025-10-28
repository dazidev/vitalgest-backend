"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shifts_service_1 = require("../services/shifts.service");
const shifts_controller_1 = require("../controllers/shifts.controller");
const shiftRoutes = express_1.default.Router();
const shiftService = new shifts_service_1.ShiftsService();
const controller = new shifts_controller_1.ShiftsController(shiftService);
shiftRoutes.post('/create', controller.createShift.bind(controller));
shiftRoutes.put('/edit/:id', controller.editShift.bind(controller));
shiftRoutes.delete('/delete/:id', controller.deleteShift.bind(controller));
shiftRoutes.get('/guard/:id', controller.getShifts.bind(controller));
shiftRoutes.get('/one/:id', controller.getOneShift.bind(controller));
exports.default = shiftRoutes;
