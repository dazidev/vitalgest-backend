import { Role } from "../enums/user-roles.enum";

export interface AccessContext {
  id: string;
  role: Role;
  delegationId: string;
}
