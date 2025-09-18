
export class UserEntity {
  constructor (
    public id?: string,
    public name?: string,
    public lastname?: string,
    public email?: string,
    public password?: string,
    public role?: string,
    public position?: string,
    public state?: string,
    public createdAt?: string, 
  ) {}

  static fromObject (object: {[key: string]: any}) {
    const {id, name, lastname, email, password, role, position, state, createdAt} = object;
    return new UserEntity(id, name, lastname, email, password, role, position, state, createdAt);
  }
}

