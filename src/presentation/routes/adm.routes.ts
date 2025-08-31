import express from 'express';
import { AdmController } from '../controllers/adm.controller';
import { AdmService } from '../services/adm.service';

const admRoutes = express.Router();

const admService = new AdmService();
const controller = new AdmController(admService);

admRoutes.post('/create/user', controller.createUser);
admRoutes.post('/get-all/users', controller.getAllUsers);
admRoutes.post('/edit/user', controller.editUser);
admRoutes.post('/delete/user', controller.deleteUser);

export default admRoutes;