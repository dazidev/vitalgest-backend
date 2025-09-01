import { ERROR_CODES, ROLE_LIST } from "../../domain";
import { regularExp } from "../../infrastructure";


export class EditUserDto {
  private constructor (
    public readonly id: string,
    public readonly name: string,
    public readonly lastname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rol: string,
  ) {};

  static create(object: {[key: string]: any}): [string?, EditUserDto?] {
    const {id, name, lastname, email, password, rol} = object;

    if (!id) return [ERROR_CODES.MISSING_USER_ID]
    if (!name) return [ERROR_CODES.MISSING_NAME];
    if (!lastname) return [ERROR_CODES.MISSING_LASTNAME];
    if (!email) return [ERROR_CODES.MISSING_EMAIL];
    if (!password) return [ERROR_CODES.MISSING_PASSWORD];
    if (!rol) return [ERROR_CODES.MISSING_ROL];
    if (!regularExp.email.test(email)) return [ERROR_CODES.INVALID_EMAIL_FORMAT];
    if (!regularExp.password.test(password)) return [ERROR_CODES.INVALID_PASSWORD_FORMAT];
    if (!ROLE_LIST.includes(rol)) return [ERROR_CODES.INVALID_ROL];

    return [undefined, new EditUserDto(id, name, lastname, email.toLowerCase(), password, rol)];
  };
};

