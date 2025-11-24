export class AmbulanceEntity {
  constructor(
    public id?: string,
    public number?: string,
    public brand?: string,
    public model?: string,
    public delegationId?: string
  ) {}

  static create(object: { [key: string]: any }) {
    const { number, brand, model, delegationId } = object;
    return new AmbulanceEntity(undefined, number, brand, model, delegationId);
  }

  static edit(object: { [key: string]: any }) {
    const { id, number, brand, model, delegationId } = object;
    return new AmbulanceEntity(id, number, brand, model, delegationId);
  }
}
