
export class DelegationEntity {
  constructor (
    public id?: string,
    public name?: string, //* se adjunta nombre de delegación
    public stateId?: number,
    public municipalityId?: number,
    public pharmacyId?: string,
  ) {}

  static fromObject (object: {[key: string]: any}) {
    const {id, name, stateId, municipalityId, pharmacyId} = object;
    return new DelegationEntity(id, name, stateId, municipalityId, pharmacyId);
  }
}