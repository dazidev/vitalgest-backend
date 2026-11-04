import { ShiftEntityDto } from "../../application";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface ShiftsServiceInterface {
  createShift(shiftEntityDto: ShiftEntityDto, userId: string): Promise<object>;
  editShift(shiftEntityDto: ShiftEntityDto, userId: string): Promise<object>;
  deleteShift(shiftEntityDto: ShiftEntityDto, userId: string): Promise<object>;
  getShifts(guardId: string, paginationDto: PaginationDto): Promise<object>;
  getOneShift(id: string): Promise<object>;
}
