import express from "express";
import { ChecklistsService } from "../services/checklists.service";
import { ChecklistsController } from "../controllers/checklists.controller";
import { checklistGasFile, checklistSignFiles } from "../../infrastructure";

const checklistsRoutes = express.Router();

const checklistsService = new ChecklistsService();
const controller = new ChecklistsController(checklistsService);

//* Ambulances
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

//* Supplies
checklistsRoutes.post(
  "/supply/create",
  controller.createSupChecklist.bind(controller)
);

checklistsRoutes.put(
  "/supply/:id/sign",
  checklistSignFiles,
  controller.signSupChecklist.bind(controller)
);

checklistsRoutes.delete(
  "/supply/delete/:id",
  controller.deleteSupChecklist.bind(controller)
);

checklistsRoutes.put(
  "/supply/answers/:id",
  controller.putSupAnswers.bind(controller)
);

checklistsRoutes.get(
  "/supply/:id",
  controller.getSupChecklist.bind(controller)
);

export default checklistsRoutes;
