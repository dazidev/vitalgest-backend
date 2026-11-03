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
  controller.createSupply.bind(controller),
);

suppliesRoutes.put("/edit/:id", controller.editSupply.bind(controller));

suppliesRoutes.delete("/delete/:id", controller.deleteSupply.bind(controller));

suppliesRoutes.get("/pharmacy/:id", controller.getSupplies.bind(controller));

suppliesRoutes.get("/one/:id", controller.getOneSupply.bind(controller));

export default suppliesRoutes;
