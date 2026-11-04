import express from "express";
import { AuthMiddleware } from "../../infrastructure";
import { LogsService } from "../services/logs.service";
import { LogsController } from "../controllers/logs.controller";

const logsRoutes = express.Router();

const logsService = new LogsService();
const controller = new LogsController(logsService);

logsRoutes.use(AuthMiddleware.validateJWT);

logsRoutes.get("/filters", controller.getFilters.bind(controller));

logsRoutes.get("/", controller.getLogs.bind(controller));

export default logsRoutes;
