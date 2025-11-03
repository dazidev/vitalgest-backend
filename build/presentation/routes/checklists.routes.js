"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checklists_service_1 = require("../services/checklists.service");
const checklists_controller_1 = require("../controllers/checklists.controller");
const infrastructure_1 = require("../../infrastructure");
const checklistsRoutes = express_1.default.Router();
const checklistsService = new checklists_service_1.ChecklistsService();
const controller = new checklists_controller_1.ChecklistsController(checklistsService);
checklistsRoutes.get('/ambulance/questions', controller.getAmbQuestions.bind(controller));
checklistsRoutes.post('/ambulance/create', infrastructure_1.checklistGasFile, controller.createAmbChecklist.bind(controller));
checklistsRoutes.put('/ambulance/:id/sign', infrastructure_1.checklistSignFiles, controller.signAmbChecklist.bind(controller));
checklistsRoutes.delete('/ambulance/delete/:id', controller.deleteAmbChecklist.bind(controller));
checklistsRoutes.put('/ambulance/answers/:id', controller.putAmbAnswers.bind(controller));
checklistsRoutes.get('/ambulance/:id', controller.getAmbChecklist.bind(controller));
exports.default = checklistsRoutes;
/*
const fd = new FormData()
fd.append('ambulanceId', ambulanceId)
fd.append('shiftId', shiftId)
fd.append('km', String(km))
fd.append('notes', notes ?? '')
fd.append('gasFile', gasInput.files[0])
fd.append('signOperatorFile', signOpInput.files[0])
fd.append('signRecipientFile', signRecInput.files[0])

await fetch('/api/ambulance', { method: 'POST', body: fd })
*/ 
