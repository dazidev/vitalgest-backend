import { RepoResponse } from "./repositorie.interface";


export interface DelegationsRepositorieInterface {
  stateExists(state: number): Promise<boolean> 
  getStates(): Promise<RepoResponse>
  getMunicipalities(state: number): Promise<RepoResponse>
}