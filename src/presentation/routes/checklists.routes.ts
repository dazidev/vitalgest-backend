import express from "express";
import { ChecklistsService } from "../services/checklists.service";
import { ChecklistsController } from "../controllers/checklists.controller";
import { checklistGasFile, checklistSignFiles } from "../../infrastructure";

const checklistsRoutes = express.Router();

const checklistsService = new ChecklistsService();
const controller = new ChecklistsController(checklistsService);

checklistsRoutes.get(
  "/ambulance/questions",
  controller.getAmbQuestions.bind(controller)
);

checklistsRoutes.post(
  "/ambulance/create",
  checklistGasFile,
  controller.createAmbChecklist.bind(controller)
);

checklistsRoutes.put(
  "/ambulance/:id/sign",
  checklistSignFiles,
  controller.signAmbChecklist.bind(controller)
);

checklistsRoutes.delete(
  "/ambulance/delete/:id",
  controller.deleteAmbChecklist.bind(controller)
);

checklistsRoutes.put(
  "/ambulance/answers/:id",
  controller.putAmbAnswers.bind(controller)
);

checklistsRoutes.get(
  "/ambulance/:id",
  controller.getAmbChecklist.bind(controller)
);

export default checklistsRoutes;

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
