import express from 'express';
import { AdmController } from '../controllers/adm.controller';
import { AdmService } from '../services/adm.service';

const admRoutes = express.Router();

const admService = new AdmService();
const controller = new AdmController(admService);

admRoutes.post('/create/user', controller.createUser.bind(controller));
admRoutes.put('/edit/user', controller.editUser);
admRoutes.delete('/delete/user', controller.deleteUser);
admRoutes.get('/get-all/users', controller.getAllUsers);

export default admRoutes;