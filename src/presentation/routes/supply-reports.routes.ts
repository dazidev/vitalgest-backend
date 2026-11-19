import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { SupplyReportsService } from "../services/supply-reports.service";
import { SupplyReportsController } from "../controllers/supply-reports.controller";
import { AuthMiddleware } from "../../infrastructure";

const supplyReportsRoutes = express.Router();

const supplyReportsService = new SupplyReportsService();
const controller = new SupplyReportsController(supplyReportsService);

//* Verificar autenticación de todas las rutas
supplyReportsRoutes.use(AuthMiddleware.validateJWT);

supplyReportsRoutes.get("/", PermissionMiddleware.allow("general_admin", "admin"),
  controller.getReports.bind(controller));

supplyReportsRoutes.get("/:id", PermissionMiddleware.allow("general_admin", "admin"),
  controller.getReport.bind(controller));

supplyReportsRoutes.put(
  "/:id/supplies",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.updateSupplies.bind(controller),
);

supplyReportsRoutes.put(
  "/:id/attend",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.attendReport.bind(controller),
);

export default supplyReportsRoutes;
