import express from 'express';
import { ChecklistsService } from '../services/checklists.service';
import { ChecklistsController } from '../controllers/checklists.controller';
import { checklistFiles } from '../../infrastructure';


const checklistsRoutes = express.Router();

const checklistsService = new ChecklistsService();
const controller = new ChecklistsController(checklistsService);

checklistsRoutes.get(
  '/ambulance/questions',
  controller.getAmbQuestions.bind(controller)
)

checklistsRoutes.post(
  '/ambulance/create',
  checklistFiles,
  controller.createAmbChecklist.bind(controller)
)


export default checklistsRoutes;



/*
const fd = new FormData()
fd.append('ambulanceId', ambulanceId)
fd.append('shiftId', shiftId)
fd.append('km', String(km))
fd.append('notes', notes ?? '')
fd.append('gasFile', gasInput.files[0])
fd.append('signOperatorFile', signOpInput.files[0])
fd.append('signRecipientFile', signRecInput.files[0])

await fetch('/api/ambulance', { method: 'POST', body: fd })
*/