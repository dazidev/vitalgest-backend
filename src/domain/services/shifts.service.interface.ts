import { ShiftEntityDto } from "../../application";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface ShiftsServiceInterface {
  createShift(shiftEntityDto: ShiftEntityDto): Promise<object>;
  editShift(shiftEntityDto: ShiftEntityDto): Promise<object>;
  deleteShift(shiftEntityDto: ShiftEntityDto): Promise<object>;
  getShifts(guardId: string, paginationDto: PaginationDto): Promise<object>;
  getOneShift(id: string): Promise<object>;
}
