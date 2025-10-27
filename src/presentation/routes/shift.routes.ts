import express from 'express';
import { ShiftsService } from '../services/shifts.service';
import { ShiftsController } from '../controllers/shifts.controller';


const shiftRoutes = express.Router();

const shiftService = new ShiftsService();
const controller = new ShiftsController(shiftService);

shiftRoutes.post(
  '/create',
  controller.createShift.bind(controller)
);

shiftRoutes.put(
  '/edit/:id',
  controller.editShift.bind(controller)
);

shiftRoutes.delete(
  '/delete/:id',
  controller.deleteShift.bind(controller)
);

shiftRoutes.get(
  '/guard/:id',
  controller.getShifts.bind(controller)
);

shiftRoutes.get(
  '/one/:id',
  controller.getOneShift.bind(controller)
);


export default shiftRoutes;