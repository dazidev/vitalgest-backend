"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = exports.User = exports.Delegation = exports.Pharmacy = exports.Municipality = exports.State = void 0;
// modelos sequelize
const delegation_model_store_1 = __importDefault(require("./sequelize/delegation-model.store"));
exports.Delegation = delegation_model_store_1.default;
const guard_model_store_1 = __importDefault(require("./sequelize/guard-model.store"));
exports.Guard = guard_model_store_1.default;
const municipality_model_store_1 = __importDefault(require("./sequelize/municipality-model.store"));
exports.Municipality = municipality_model_store_1.default;
const pharmacy_model_store_1 = __importDefault(require("./sequelize/pharmacy-model.store"));
exports.Pharmacy = pharmacy_model_store_1.default;
const state_model_store_1 = __importDefault(require("./sequelize/state-model.store"));
exports.State = state_model_store_1.default;
const user_model_store_1 = __importDefault(require("./sequelize/user-model.store"));
exports.User = user_model_store_1.default;
// Definicion de asociaciones 
state_model_store_1.default.hasMany(municipality_model_store_1.default, { foreignKey: 'state_id', as: 'municipalities' });
municipality_model_store_1.default.belongsTo(state_model_store_1.default, { foreignKey: 'state_id', as: 'state' });
state_model_store_1.default.hasMany(delegation_model_store_1.default, { foreignKey: 'state_id', as: 'delegations' });
municipality_model_store_1.default.hasMany(delegation_model_store_1.default, { foreignKey: 'municipality_id', as: 'delegations' });
pharmacy_model_store_1.default.hasMany(delegation_model_store_1.default, { foreignKey: 'pharmacy_id', as: 'delegations' });
delegation_model_store_1.default.belongsTo(state_model_store_1.default, { foreignKey: 'state_id', as: 'state' });
delegation_model_store_1.default.belongsTo(municipality_model_store_1.default, { foreignKey: 'municipality_id', as: 'municipality' });
delegation_model_store_1.default.belongsTo(pharmacy_model_store_1.default, { foreignKey: 'pharmacy_id', as: 'pharmacy' });
guard_model_store_1.default.belongsTo(user_model_store_1.default, { foreignKey: 'guard_chief', as: 'guardChief' });
user_model_store_1.default.hasMany(guard_model_store_1.default, { foreignKey: 'guard_chief', as: 'guardsAsChief' });
guard_model_store_1.default.belongsTo(delegation_model_store_1.default, { foreignKey: 'delegation_id', as: 'delegation' });
delegation_model_store_1.default.hasMany(guard_model_store_1.default, { foreignKey: 'delegation_id', as: 'guards' });
