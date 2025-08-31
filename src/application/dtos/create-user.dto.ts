import { ROLE_LIST } from "../../domain";
import { regularExp } from "../../infrastructure";


export class CreateUserDto {
  private constructor (
    public readonly name: string,
    public readonly lastname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rol: string,
  ) {};

  static create(object: {[key: string]: any}): [string?, CreateUserDto?] {
    const {name, lastname, email, password, rol} = object;

    if (!name) return ['MISSING_NAME'];
    if (!lastname) return ['MISSING_LASTNAME'];
    if (!email) return ['MISSING_EMAIL'];
    if (!password) return ['MISSING_PASSWORD'];
    if (!rol) return ['MISSING_ROL'];
    if (!regularExp.email.test(email)) return ['INVALID_EMAIL_FORMAT'];
    if (!regularExp.password.test(password)) return ['INVALID_PASSWORD_FORMAT'];
    if (!ROLE_LIST.includes(rol)) return ['INVALID_ROL'];

    return [undefined, new CreateUserDto(name, lastname, email.toLowerCase(), password, rol)];
  };
};

