"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntityDto = void 0;
const domain_1 = require("../../domain");
const infrastructure_1 = require("../../infrastructure");
class UserEntityDto {
    constructor(props) {
        Object.assign(this, props);
    }
    ;
    static create(object) {
        const { name, lastname, email, password, role, position, delegationId } = object;
        const validate = this.validateData(object, 'create');
        if (validate !== null)
            return validate;
        return [undefined, new UserEntityDto({ name, lastname, email: email.toLowerCase(), password, role, position, delegationId })];
    }
    ;
    static edit(object) {
        const { id, name, lastname, email, role, position, delegationId, status } = object;
        const validate = this.validateData(object, 'edit');
        if (validate !== null)
            return validate;
        return [undefined, new UserEntityDto({ id, name, lastname, email: email.toLowerCase(), role, position, delegationId, status })];
    }
    ;
    static login(object) {
        const { email, password } = object;
        const validate = this.validateData(object, 'password');
        if (validate !== null)
            return validate;
        return [undefined, new UserEntityDto({ email: email.toLowerCase(), password })];
    }
    ;
}
exports.UserEntityDto = UserEntityDto;
UserEntityDto.validateData = (object, type) => {
    const { id, name, lastname, email, password, role, position, delegationId, status } = object;
    if (type === 'password') {
        if (!email)
            return [domain_1.ERROR_CODES.MISSING_EMAIL];
        if (!infrastructure_1.regularExp.email.test(email))
            return [domain_1.ERROR_CODES.INVALID_EMAIL_FORMAT];
        if (!password)
            return [domain_1.ERROR_CODES.MISSING_PASSWORD];
        if (!infrastructure_1.regularExp.password.test(password))
            return [domain_1.ERROR_CODES.INVALID_PASSWORD_FORMAT];
        return null;
    }
    if (type === 'edit') {
        if (!id)
            return [domain_1.ERROR_CODES.MISSING_USER_ID];
        if (!status)
            return [domain_1.ERROR_CODES.MISSING_STATUS];
    }
    if (!name)
        return [domain_1.ERROR_CODES.MISSING_NAME];
    if (!lastname)
        return [domain_1.ERROR_CODES.MISSING_LASTNAME];
    if (!email)
        return [domain_1.ERROR_CODES.MISSING_EMAIL];
    if (!infrastructure_1.regularExp.email.test(email))
        return [domain_1.ERROR_CODES.INVALID_EMAIL_FORMAT];
    if (type === 'create') {
        if (!password)
            return [domain_1.ERROR_CODES.MISSING_PASSWORD];
        if (!infrastructure_1.regularExp.password.test(password))
            return [domain_1.ERROR_CODES.INVALID_PASSWORD_FORMAT];
    }
    if (!role)
        return [domain_1.ERROR_CODES.MISSING_ROLE];
    if (!position)
        return [domain_1.ERROR_CODES.MISSING_POSITION];
    if (!domain_1.ROLE_LIST.includes(role))
        return [domain_1.ERROR_CODES.INVALID_ROLE];
    if (!delegationId)
        return [domain_1.ERROR_CODES.MISSING_DELEGATION_ID];
    return null;
};
;
