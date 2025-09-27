
export interface DelegationsServiceInterface {
  getStates(): Promise<object>
  getMunicipalities(state: number): Promise<object>
}