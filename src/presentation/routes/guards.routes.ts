import express from "express";
import { GuardsService } from "../services/guards.service";
import { GuardsController } from "../controllers/guards.controller";
import { AuthMiddleware } from "../../infrastructure";

const guardsRoutes = express.Router();

const guardService = new GuardsService();
const controller = new GuardsController(guardService);

//* Verificar autenticación de todas las rutas
guardsRoutes.use(AuthMiddleware.validateJWT);

guardsRoutes.post("/create", controller.createGuard.bind(controller));

guardsRoutes.put("/edit/:id", controller.editGuard.bind(controller));

guardsRoutes.delete("/delete/:id", controller.deleteGuard.bind(controller));

guardsRoutes.get("/many", controller.getGuards.bind(controller));

guardsRoutes.get("/one/:id", controller.getOneGuard.bind(controller));

export default guardsRoutes;
