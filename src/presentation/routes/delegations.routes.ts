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

delegationsRoutes.post(
  '/create',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.createDelegation.bind(controller)
);

delegationsRoutes.put(
  '/edit/:id',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.editDelegation.bind(controller)
);

delegationsRoutes.delete(
  '/delete/:id',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.deleteDelegation.bind(controller)
);

delegationsRoutes.get(
  '/many/:amount',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.getDelegations.bind(controller)
);

delegationsRoutes.get(
  '/one/:id',
  //[AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.getDelegation.bind(controller)
);


export default delegationsRoutes;