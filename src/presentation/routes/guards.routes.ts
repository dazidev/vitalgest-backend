import express from 'express';
import { GuardsService } from '../services/guards.service';
import { GuardsController } from '../controllers/guards.controller';


const guardsRoutes = express.Router();

const guardService = new GuardsService();
const controller = new GuardsController(guardService);

guardsRoutes.post(
  '/create',
  controller.createGuard.bind(controller)
);

guardsRoutes.put(
  '/edit/:id',
  controller.editGuard.bind(controller)
);

guardsRoutes.delete(
  '/delete/:id',
  controller.deleteGuard.bind(controller)
);

guardsRoutes.get(
  '/many/:amount',
  controller.getGuards.bind(controller)
);

guardsRoutes.get(
  '/one/:id',
  controller.getOneGuard.bind(controller)
);

export default guardsRoutes;