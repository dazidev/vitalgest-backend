import { AccessContext } from "../interfaces/access-context.interface";
import { ShiftEntityDto } from "../../application";
import { PaginationDto } from "../../application/dtos/pagination.dto";

export interface ShiftsServiceInterface {
  createShift(actor: AccessContext, shiftEntityDto: ShiftEntityDto, userId: string): Promise<object>;
  editShift(actor: AccessContext, shiftEntityDto: ShiftEntityDto, userId: string): Promise<object>;
  deleteShift(actor: AccessContext, shiftEntityDto: ShiftEntityDto, userId: string): Promise<object>;
  getShifts(actor: AccessContext, guardId: string, paginationDto: PaginationDto): Promise<object>;
  getOneShift(actor: AccessContext, id: string): Promise<object>;
}
