export class UserEntity {
  constructor(
    public id?: string,
    public name?: string,
    public lastname?: string,
    public email?: string,
    public password?: string,
    public status?: boolean,
    public role?: string,
    public position?: string,
    public delegation_id?: string
  ) {}

  static create(object: { [key: string]: any }) {
    const {
      name,
      lastname,
      email,
      hashedPassword,
      role,
      position,
      delegation_id,
    } = object;
    return new UserEntity(
      undefined,
      name,
      lastname,
      email,
      hashedPassword,
      undefined,
      role,
      position,
      delegation_id
    );
  }

  static payloadToken(object: { [key: string]: any }) {
    const { id, name, lastname, email, role } = object;
    return new UserEntity(
      id,
      name,
      lastname,
      email,
      undefined,
      undefined,
      role
    );
  }

  static login(object: { [key: string]: any }) {
    const { id, name, lastname, email, status, role, position, delegation_id } =
      object;
    return new UserEntity(
      id,
      name,
      lastname,
      email,
      undefined,
      status,
      role,
      position,
      delegation_id
    );
  }
}
