import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { ShiftsService } from "../services/shifts.service";
import { ShiftsController } from "../controllers/shifts.controller";
import { AuthMiddleware } from "../../infrastructure";

const shiftRoutes = express.Router();

const shiftService = new ShiftsService();
const controller = new ShiftsController(shiftService);

//* Verificar autenticación de todas las rutas
shiftRoutes.use(AuthMiddleware.validateJWT);

shiftRoutes.post("/create", PermissionMiddleware.allow("general_admin", "admin", "head_guard"),
  controller.createShift.bind(controller));

shiftRoutes.put("/edit/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard"),
  controller.editShift.bind(controller));

shiftRoutes.delete("/delete/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard"),
  controller.deleteShift.bind(controller));

shiftRoutes.get("/guard/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getShifts.bind(controller));

shiftRoutes.get("/one/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getOneShift.bind(controller));

export default shiftRoutes;
