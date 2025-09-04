"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_RANK = exports.ROLE_LIST = exports.ROLE = void 0;
// definición de los roles como un obj
exports.ROLE = {
    PARAMEDICAL: 'paramedical',
    VEHICLE_OPERATOR: 'vehicle_operator',
    HEAD_GUARD: 'head_guard',
    ADMIN: 'admin',
    GENERAL_ADMIN: 'general_admin'
};
// lista de roles segun los valores del objeto ROLE
exports.ROLE_LIST = Object.values(exports.ROLE);
// asignación númerica de cada rol 
exports.ROLE_RANK = {
    paramedical: 10,
    vehicle_operator: 20,
    head_guard: 30,
    admin: 40,
    general_admin: 50,
};
