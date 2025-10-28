"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checklists_service_1 = require("../services/checklists.service");
const checklists_controller_1 = require("../controllers/checklists.controller");
const checklistsRoutes = express_1.default.Router();
const checklistsService = new checklists_service_1.ChecklistsService();
const controller = new checklists_controller_1.ChecklistsController(checklistsService);
checklistsRoutes.get('/ambulance/questions', controller.getAmbQuestions.bind(controller));
exports.default = checklistsRoutes;
