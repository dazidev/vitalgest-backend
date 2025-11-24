"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guards_service_1 = require("../services/guards.service");
const guards_controller_1 = require("../controllers/guards.controller");
const guardsRoutes = express_1.default.Router();
const guardService = new guards_service_1.GuardsService();
const controller = new guards_controller_1.GuardsController(guardService);
guardsRoutes.post("/create", controller.createGuard.bind(controller));
guardsRoutes.put("/edit/:id", controller.editGuard.bind(controller));
guardsRoutes.delete("/delete/:id", controller.deleteGuard.bind(controller));
guardsRoutes.get("/many/:amount", controller.getGuards.bind(controller));
guardsRoutes.get("/one/:id", controller.getOneGuard.bind(controller));
exports.default = guardsRoutes;
