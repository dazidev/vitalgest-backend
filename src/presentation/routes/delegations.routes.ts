import express from 'express';
//import { AuthMiddleware, RankMiddleware } from '../../infrastructure';
import { DelegationsController } from '../controllers/delegations.controller';
import { DelegationsService } from '../services/delegations.service';

const delegationsRoutes = express.Router();

const service = new DelegationsService()
const controller = new DelegationsController(service)

delegationsRoutes.get(
  '/states',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.getStates.bind(controller)
);

delegationsRoutes.get(
  '/state/:stateId/municipalities',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.getMunicipalities.bind(controller)
);


export default delegationsRoutes;