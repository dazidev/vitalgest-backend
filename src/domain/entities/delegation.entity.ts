
export class DelegationEntity {
  constructor (
    public id?: string,
    public name?: string, //* se adjunta nombre de delegación
    public stateName?: string,
    public municipalityId?: number,
    public municipalityName?: string,
    public pharmacyId?: string,
  ) {}

  static fromObject (object: {[key: string]: any}) {
    const {id, name, stateName, municipalityId, municipalityName, pharmacyId} = object;
    return new DelegationEntity(id, name, stateName, municipalityId, municipalityName, pharmacyId);
  }
}