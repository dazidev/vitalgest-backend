import express from "express";
import { SupplyReportsService } from "../services/supply-reports.service";
import { SupplyReportsController } from "../controllers/supply-reports.controller";

const supplyReportsRoutes = express.Router();

const supplyReportsService = new SupplyReportsService();
const controller = new SupplyReportsController(supplyReportsService);

supplyReportsRoutes.get("/", controller.getReports.bind(controller));

supplyReportsRoutes.put(
  "/:id/supplies",
  controller.updateSupplies.bind(controller),
);

supplyReportsRoutes.put(
  "/:id/attend",
  controller.attendReport.bind(controller),
);

export default supplyReportsRoutes;
