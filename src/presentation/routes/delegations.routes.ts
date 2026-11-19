import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { DelegationsController } from "../controllers/delegations.controller";
import { DelegationsService } from "../services/delegations.service";
import { AuthMiddleware } from "../../infrastructure";

const delegationsRoutes = express.Router();

const service = new DelegationsService();
const controller = new DelegationsController(service);

//* Verificar autenticación de todas las rutas
delegationsRoutes.use(AuthMiddleware.validateJWT);

delegationsRoutes.get(
  "/states",
  PermissionMiddleware.allow("general_admin"),
  controller.getStates.bind(controller),
);

delegationsRoutes.get(
  "/state/:stateId/municipalities",
  PermissionMiddleware.allow("general_admin"),
  controller.getMunicipalities.bind(controller),
);

delegationsRoutes.post(
  "/create",
  PermissionMiddleware.allow("general_admin"),
  controller.createDelegation.bind(controller),
);

delegationsRoutes.put(
  "/edit/:id",
  PermissionMiddleware.allow("general_admin"),
  controller.editDelegation.bind(controller),
);

delegationsRoutes.delete(
  "/delete/:id",
  PermissionMiddleware.allow("general_admin"),
  controller.deleteDelegation.bind(controller),
);

delegationsRoutes.get(
  "/many",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getDelegations.bind(controller),
);

delegationsRoutes.get(
  "/one/:id",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getDelegation.bind(controller),
);

delegationsRoutes.get(
  "/members/:id",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getMembers.bind(controller),
);

export default delegationsRoutes;
