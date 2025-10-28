import { ShiftEntityDto } from "../../application";


export interface ShiftsServiceInterface {
  createShift (shiftEntityDto: ShiftEntityDto): Promise<object>;
  editShift (shiftEntityDto: ShiftEntityDto): Promise<object>;
  deleteShift (shiftEntityDto: ShiftEntityDto): Promise<object>;
  getShifts (guardId: string): Promise<object>;
  getOneShift (id: string): Promise<object>;
};