import { PermissionMiddleware } from "../../infrastructure/middlewares/permission.middleware";
import express from "express";
import { AuthMiddleware } from "../../infrastructure";
import { AmbulancesService } from "../services/ambulance.service";
import { AmbulancesController } from "../controllers/ambulances.controller";

const AmbulanceRoutes = express.Router();

const ambulanceService = new AmbulancesService();
const controller = new AmbulancesController(ambulanceService);

//* Verificar autenticación de todas las rutas
AmbulanceRoutes.use(AuthMiddleware.validateJWT);

AmbulanceRoutes.post("/create", PermissionMiddleware.allow("general_admin", "admin"),
  controller.createAmbulance.bind(controller));

AmbulanceRoutes.put("/edit/:id", PermissionMiddleware.allow("general_admin", "admin"),
  controller.editAmbulance.bind(controller));

AmbulanceRoutes.delete(
  "/delete/:id",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteAmbulance.bind(controller),
);

AmbulanceRoutes.get("/many", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getAmbulances.bind(controller));

AmbulanceRoutes.get("/one/:id", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getOneAmbulance.bind(controller));

//* SUPPLIES
AmbulanceRoutes.get("/areas", PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getAreas.bind(controller));

AmbulanceRoutes.post(
  "/supplies/create/:id",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.addSupply.bind(controller),
);

AmbulanceRoutes.put(
  "/supplies/edit/:id",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.editSupply.bind(controller),
);

AmbulanceRoutes.delete(
  "/supplies/delete/:id",
  PermissionMiddleware.allow("general_admin", "admin"),
  controller.deleteSupply.bind(controller),
);

AmbulanceRoutes.get(
  "/supplies/:id",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getAmbSupplies.bind(controller),
);

AmbulanceRoutes.get(
  "/supplies/one/:id",
  PermissionMiddleware.allow("general_admin", "admin", "head_guard", "vehicle_operator", "paramedical"),
  controller.getOneAmbSupply.bind(controller),
);

export default AmbulanceRoutes;
