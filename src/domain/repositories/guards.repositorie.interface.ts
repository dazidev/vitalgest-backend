import { RepoResponse } from "./repositorie.interface";
import { GuardsEntityDto } from '../../application/dtos/guard-entity.dto';



export interface GuardsRepositorieInterface {
  createGuard(guardsEntityDto: GuardsEntityDto): Promise<RepoResponse>
  editGuard(guardsEntityDto: GuardsEntityDto): Promise<RepoResponse>
  deleteGuard(id: string): Promise<RepoResponse>
  isGuardChief(id: string): Promise<boolean>
  existsDelegation(id: string): Promise<boolean>
  existsGuard(date: string, delegationId: string): Promise<boolean>
  getGuards(amount: number | string): Promise<RepoResponse>
  getOneGuard(id: string): Promise<RepoResponse>
}