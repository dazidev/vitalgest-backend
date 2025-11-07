
export class DelegationEntity {
  constructor (
    public id?: string,
    public municipalityId?: number,
    public pharmacyId?: string,
  ) {}

  static fromObject (object: {[key: string]: any}) {
    const {id, municipalityId, pharmacyId} = object;
    return new DelegationEntity(id, municipalityId, pharmacyId);
  }
}