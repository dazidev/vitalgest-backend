import { DelegationsServiceInterface } from "../../domain";
import { DelegationsRepositorie } from '../../infrastructure/repositories/delegations.repositorie';
import { ERROR_CODES } from '../../domain/enums/error-codes.enum';


export class DelegationsService implements DelegationsServiceInterface {
  private readonly delegationsRepo: DelegationsRepositorie

  constructor (){
    this.delegationsRepo = new DelegationsRepositorie()
  }

  async getStates(): Promise<object> {
    const states = await this.delegationsRepo.getStates()

    if (!states.success) throw { code: states.code }
    if (Array.isArray(states.data)){
      if (states.data.length === 0) throw { code: ERROR_CODES.STATES_NOT_FOUND}
    }

    return states
  }

  async getMunicipalities(state: number): Promise<object> {
    const exists = await this.delegationsRepo.stateExists(state)
    if (!exists) throw { code: ERROR_CODES.STATE_NOT_FOUND }

    const municipalities = await this.delegationsRepo.getMunicipalities(state)

    if (!municipalities.success) throw { code: municipalities.code }
    if (Array.isArray(municipalities.data)){
      if (municipalities.data.length === 0) throw { code: ERROR_CODES.MUNICIPALITIES_NOT_FOUND }
    }

    return municipalities
  }
  
}