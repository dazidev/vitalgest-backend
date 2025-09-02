import { ERROR_CODES, ROLE_LIST } from "../../domain";
import { regularExp } from "../../infrastructure";


type UserDtoProps = {
  id?: string;
  name: string;
  lastname: string;
  email: string;
  rol: string;
  password?: string;
};


export class UserEntityDto {
  readonly id?: string;
  readonly name!: string;
  readonly lastname!: string;
  readonly email!: string;
  readonly rol!: string;
  readonly password?: string;

  private constructor (props: UserDtoProps) {
    Object.assign(this, props);
  };

  private static validateData = (object: any, type: 'create' | 'edit'): null | [string] => {
    const {id, name, lastname, email, password, rol} = object;
    
    if (type === 'edit') if (!id) return [ERROR_CODES.MISSING_USER_ID];
    if (!name) return [ERROR_CODES.MISSING_NAME];
    if (!lastname) return [ERROR_CODES.MISSING_LASTNAME];
    if (!email) return [ERROR_CODES.MISSING_EMAIL];
    if (type === 'create'){
      if (!password) return [ERROR_CODES.MISSING_PASSWORD];
      if (!regularExp.password.test(password)) return [ERROR_CODES.INVALID_PASSWORD_FORMAT];
    }
    if (!rol) return [ERROR_CODES.MISSING_ROL];
    if (!regularExp.email.test(email)) return [ERROR_CODES.INVALID_EMAIL_FORMAT];
    if (!ROLE_LIST.includes(rol)) return [ERROR_CODES.INVALID_ROL];

    return null
  };

  static create(object: {[key: string]: any}): [string?, UserEntityDto?] {
    const {name, lastname, email, password, rol} = object;

    const validate = this.validateData(object, 'create');
    if (validate !== null) return validate;

    return [undefined, new UserEntityDto({ name, lastname, email: email.toLowerCase(), password, rol })];
  };

  static edit(object: {[key: string]: any}): [string?, UserEntityDto?] {
    const {id, name, lastname, email, rol} = object;

    const validate = this.validateData(object, 'edit');
    if (validate !== null) return validate;

    return [undefined, new UserEntityDto({ id, name, lastname, email: email.toLowerCase(), rol })];
  };
};

