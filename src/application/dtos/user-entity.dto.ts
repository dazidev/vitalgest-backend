import { ERROR_CODES, ROLE_LIST } from "../../domain";
import { regularExp } from "../../infrastructure";


type UserDtoProps = {
  id?: string;
  name?: string;
  lastname?: string;
  email?: string;
  role?: string;
  position?: string;
  password?: string;
  delegationId?: string;
};


export class UserEntityDto {
  readonly id?: string;
  readonly name?: string;
  readonly lastname?: string;
  readonly email?: string;
  readonly role?: string;
  readonly position?: string;
  readonly password?: string;
  readonly delegationId?: string;

  private constructor (props: UserDtoProps) {
    Object.assign(this, props);
  };

  private static validateData = (object: any, type: 'create' | 'edit' | 'password'): null | [string] => {
    const {id, name, lastname, email, password, role, position, delegationId} = object;
    
    if (type === 'password') {
      if (!email) return [ERROR_CODES.MISSING_EMAIL];
      if (!regularExp.email.test(email)) return [ERROR_CODES.INVALID_EMAIL_FORMAT];
      if (!password) return [ERROR_CODES.MISSING_PASSWORD];
      if (!regularExp.password.test(password)) return [ERROR_CODES.INVALID_PASSWORD_FORMAT];
      return null
    }

    if (type === 'edit') if (!id) return [ERROR_CODES.MISSING_USER_ID];
    if (!name) return [ERROR_CODES.MISSING_NAME];
    if (!lastname) return [ERROR_CODES.MISSING_LASTNAME];
    if (!email) return [ERROR_CODES.MISSING_EMAIL];
    if (!regularExp.email.test(email)) return [ERROR_CODES.INVALID_EMAIL_FORMAT];
    
    if (type === 'create') {
      if (!password) return [ERROR_CODES.MISSING_PASSWORD];
      if (!regularExp.password.test(password)) return [ERROR_CODES.INVALID_PASSWORD_FORMAT];
    }
    if (!role) return [ERROR_CODES.MISSING_ROLE];
    if (!position) return [ERROR_CODES.MISSING_POSITION]
    if (!ROLE_LIST.includes(role)) return [ERROR_CODES.INVALID_ROLE];
    if (!delegationId) return [ERROR_CODES.MISSING_DELEGATION_ID]

    return null
  };

  static create(object: {[key: string]: any}): [string?, UserEntityDto?] {
    const {name, lastname, email, password, role, position, delegationId} = object;

    const validate = this.validateData(object, 'create');
    if (validate !== null) return validate;

    return [undefined, new UserEntityDto({ name, lastname, email: email.toLowerCase(), password, role, position, delegationId })];
  };

  static edit(object: {[key: string]: any}): [string?, UserEntityDto?] {
    const {id, name, lastname, email, role, position, delegationId} = object;

    const validate = this.validateData(object, 'edit');
    if (validate !== null) return validate;

    return [undefined, new UserEntityDto({ id, name, lastname, email: email.toLowerCase(), role, position, delegationId })];
  };

  static login(object: {[key: string]: any}): [string?, UserEntityDto?] {
    const {email, password} = object;

    const validate = this.validateData(object, 'password');
    if (validate !== null) return validate;

    return [undefined, new UserEntityDto({ email: email.toLowerCase(), password })];
  };
};

