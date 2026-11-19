import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { GuardsService } from "../services/guards.service";
import { GuardsController } from "../controllers/guards.controller";
import { AuthMiddleware } from "../../infrastructure";

const guardsRoutes = express.Router();

const guardService = new GuardsService();
const controller = new GuardsController(guardService);

//* Verificar autenticación de todas las rutas
guardsRoutes.use(AuthMiddleware.validateJWT);

guardsRoutes.post("/create", PermissionMiddleware.allow("general_admin", "admin", "head_guard"),
  controller.createGuard.bind(controller));

guardsRoutes.put("/edit/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard"),
  controller.editGuard.bind(controller));

guardsRoutes.delete("/delete/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard"),
  controller.deleteGuard.bind(controller));

guardsRoutes.get("/many", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getGuards.bind(controller));

guardsRoutes.get("/one/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getOneGuard.bind(controller));

export default guardsRoutes;
