import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { ChecklistsService } from "../services/checklists.service";
import { ChecklistsController } from "../controllers/checklists.controller";
import { AuthMiddleware } from "../../infrastructure";
// import { checklistGasFile, checklistSignFiles } from "../../infrastructure";

const checklistsRoutes = express.Router();

const checklistsService = new ChecklistsService();
const controller = new ChecklistsController(checklistsService);

//* Verificar autenticación de todas las rutas
checklistsRoutes.use(AuthMiddleware.validateJWT);

//* Ambulances
checklistsRoutes.get(
  "/ambulance/questions",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator"),
  controller.getAmbQuestions.bind(controller),
);

checklistsRoutes.post(
  "/ambulance/create",
  //checklistGasFile,
  PermissionMiddleware.allow("general_admin", "admin", "vehicle_operator"),
  controller.createAmbChecklist.bind(controller),
);

checklistsRoutes.put(
  "/ambulance/:id/sign",
  //checklistSignFiles,
  PermissionMiddleware.allow("general_admin", "admin", "vehicle_operator"),
  controller.signAmbChecklist.bind(controller),
);

checklistsRoutes.delete(
  "/ambulance/delete/:id",
  PermissionMiddleware.allow("general_admin", "admin", "vehicle_operator"),
  controller.deleteAmbChecklist.bind(controller),
);

checklistsRoutes.put(
  "/ambulance/answers/:id",
  PermissionMiddleware.allow("general_admin", "admin", "vehicle_operator"),
  controller.putAmbAnswers.bind(controller),
);

checklistsRoutes.get(
  "/ambulance/:id",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getAmbChecklist.bind(controller),
);

//* Supplies
checklistsRoutes.post(
  "/supply/create",
  PermissionMiddleware.allow("general_admin", "admin", "paramedical"),
  controller.createSupChecklist.bind(controller),
);

checklistsRoutes.put(
  "/supply/:id/sign",
  //checklistSignFiles,
  PermissionMiddleware.allow("general_admin", "admin", "paramedical"),
  controller.signSupChecklist.bind(controller),
);

checklistsRoutes.delete(
  "/supply/delete/:id",
  PermissionMiddleware.allow("general_admin", "admin", "paramedical"),
  controller.deleteSupChecklist.bind(controller),
);

checklistsRoutes.put(
  "/supply/answers/:id",
  PermissionMiddleware.allow("general_admin", "admin", "paramedical"),
  controller.putSupAnswers.bind(controller),
);

checklistsRoutes.get(
  "/supply/:id",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getSupChecklist.bind(controller),
);

export default checklistsRoutes;
