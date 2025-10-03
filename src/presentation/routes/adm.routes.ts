import express from 'express';
import { AdmController } from '../controllers/adm.controller';
import { AdmService } from '../services/adm.service';
import { AuthMiddleware, RankMiddleware } from '../../infrastructure';

const admRoutes = express.Router();

const admService = new AdmService();
const controller = new AdmController(admService);

admRoutes.post(
  '/create/user',
  [AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.createUser.bind(controller)
);

admRoutes.put(
  '/edit/user/:id',
  [AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.editUser.bind(controller)
);

admRoutes.delete(
  '/delete/user/:id',
  [AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.deleteUser.bind(controller)
);

admRoutes.get(
  '/get-all/users/:amount',
  [AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.getAllUsers.bind(controller)
);

admRoutes.put(
  '/change-password/user/:id',
  [AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.changePasswordUser.bind(controller)
);

admRoutes.get(
  '/get/user/:id',
  [AuthMiddleware.validateJWT, RankMiddleware.validate('admin')],
  controller.getUserById.bind(controller)
);

export default admRoutes;