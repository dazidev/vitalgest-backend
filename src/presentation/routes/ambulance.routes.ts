import express from "express";
import { AuthMiddleware } from "../../infrastructure";
import { AmbulancesService } from "../services/ambulance.service";
import { AmbulancesController } from "../controllers/ambulances.controller";

const AmbulanceRoutes = express.Router();

const ambulanceService = new AmbulancesService();
const controller = new AmbulancesController(ambulanceService);

//* Verificar autenticación de todas las rutas
AmbulanceRoutes.use(AuthMiddleware.validateJWT);

AmbulanceRoutes.post("/create", controller.createAmbulance.bind(controller));

AmbulanceRoutes.put("/edit/:id", controller.editAmbulance.bind(controller));

AmbulanceRoutes.delete(
  "/delete/:id",
  controller.deleteAmbulance.bind(controller),
);

AmbulanceRoutes.get("/many", controller.getAmbulances.bind(controller));

AmbulanceRoutes.get("/one/:id", controller.getOneAmbulance.bind(controller));

//* SUPPLIES
AmbulanceRoutes.get("/areas", controller.getAreas.bind(controller));

AmbulanceRoutes.post(
  "/supplies/create/:id",
  controller.addSupply.bind(controller),
);

AmbulanceRoutes.put(
  "/supplies/edit/:id",
  controller.editSupply.bind(controller),
);

AmbulanceRoutes.delete(
  "/supplies/delete/:id",
  controller.deleteSupply.bind(controller),
);

AmbulanceRoutes.get(
  "/supplies/:id",
  controller.getAmbSupplies.bind(controller),
);

AmbulanceRoutes.get(
  "/supplies/one/:id",
  controller.getOneAmbSupply.bind(controller),
);

export default AmbulanceRoutes;
