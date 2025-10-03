
export class GuardEntity {
  constructor (
    public id?: string,
    public guardChief?: string,
    public date?: string,
    public delegationId?: string
  ) {}

  static fromObject (object: {[key: string]: any}) {
    const {id, guardChief, date, delegationId} = object;
    return new GuardEntity(id, guardChief, date, delegationId);
  }
}