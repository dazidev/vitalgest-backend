import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { SuppliesService } from "../services/supplies.service";
import { SuppliesController } from "../controllers/supplies.controller";
import { AuthMiddleware } from "../../infrastructure";

const suppliesRoutes = express.Router();

const suppliesService = new SuppliesService();
const controller = new SuppliesController(suppliesService);

//* Verificar autenticación de todas las rutas
suppliesRoutes.use(AuthMiddleware.validateJWT);

suppliesRoutes.post(
  "/create/pharmacy/:id",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.createSupply.bind(controller),
);

suppliesRoutes.put("/edit/:id", PermissionMiddleware.allow("general_admin", "admin"),
  controller.editSupply.bind(controller));

suppliesRoutes.delete("/delete/:id", PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteSupply.bind(controller));

suppliesRoutes.get("/pharmacy/:id", PermissionMiddleware.allow("general_admin", "admin"),
  controller.getSupplies.bind(controller));

suppliesRoutes.get("/one/:id", PermissionMiddleware.allow("general_admin", "admin"),
  controller.getOneSupply.bind(controller));

export default suppliesRoutes;
