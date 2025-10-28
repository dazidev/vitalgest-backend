import express from 'express';
import { ChecklistsService } from '../services/checklists.service';
import { ChecklistsController } from '../controllers/checklists.controller';


const checklistsRoutes = express.Router();

const checklistsService = new ChecklistsService();
const controller = new ChecklistsController(checklistsService);

checklistsRoutes.get(
  '/ambulance/questions',
  controller.getAmbQuestions.bind(controller)
);


export default checklistsRoutes;