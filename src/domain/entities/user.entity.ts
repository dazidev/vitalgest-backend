
export class UserEntity {
  constructor (
    public id: string,
    public name: string,
    public lastname: string,
    public email: string,
    public rol: string,
    public password?: string,
    public state?: number,
    public createdAt?: string, 
  ) {}

  static fromObject (object: {[key: string]: any}) {
    const {id, name, lastname, email, password, rol, state, createdAt} = object;
    return new UserEntity(id, name, lastname, email, password, rol, state, createdAt);
  }
}

