import express from 'express';
import { AmbulancesService } from '../services/ambulance.service';
import { AmbulancesController } from '../controllers/ambulances.controller';


const AmbulanceRoutes = express.Router();

const ambulanceService = new AmbulancesService();
const controller = new AmbulancesController(ambulanceService);

AmbulanceRoutes.post(
  '/create',
  controller.createAmbulance.bind(controller)
);

AmbulanceRoutes.put(
  '/edit/:id',
  controller.editAmbulance.bind(controller)
);

AmbulanceRoutes.delete(
  '/delete/:id',
  controller.deleteAmbulance.bind(controller)
);

AmbulanceRoutes.get(
  '/many/:amount',
  controller.getAmbulances.bind(controller)
);

AmbulanceRoutes.get(
  '/one/:id',
  controller.getOneAmbulance.bind(controller)
);

export default AmbulanceRoutes;