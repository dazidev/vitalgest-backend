"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerComponent = exports.Answer = exports.Question = exports.ChecklistAmbulance = exports.Shift = exports.Ambulance = exports.Guard = exports.User = exports.Delegation = exports.Pharmacy = exports.Municipality = exports.State = void 0;
// Modelos sequelize
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
const ambulance_model_store_1 = __importDefault(require("./sequelize/ambulance-model.store"));
exports.Ambulance = ambulance_model_store_1.default;
const shift_model_store_1 = __importDefault(require("./sequelize/shift-model.store"));
exports.Shift = shift_model_store_1.default;
const checklist_supply_model_store_1 = __importDefault(require("./sequelize/checklist/checklist-supply-model.store"));
const checklist_ambulance_model_store_1 = __importDefault(require("./sequelize/checklist/checklist-ambulance-model.store"));
exports.ChecklistAmbulance = checklist_ambulance_model_store_1.default;
const question_model_store_1 = __importDefault(require("./sequelize/checklist/question-model.store"));
exports.Question = question_model_store_1.default;
const answer_model_store_1 = __importDefault(require("./sequelize/checklist/answer-model.store"));
exports.Answer = answer_model_store_1.default;
const answer_component_model_store_1 = __importDefault(require("./sequelize/checklist/answer-component-model.store"));
exports.AnswerComponent = answer_component_model_store_1.default;
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
// Ambulancias
ambulance_model_store_1.default.belongsTo(delegation_model_store_1.default, { foreignKey: 'delegation_id', as: 'delegation' });
delegation_model_store_1.default.hasMany(ambulance_model_store_1.default, { foreignKey: 'delegation_id', as: 'ambulances' });
// Turnos
shift_model_store_1.default.belongsTo(guard_model_store_1.default, { foreignKey: 'guard_id', as: 'guard' });
guard_model_store_1.default.hasMany(shift_model_store_1.default, { foreignKey: 'guard_id', as: 'guard' });
shift_model_store_1.default.belongsTo(ambulance_model_store_1.default, { foreignKey: 'ambulance_id', as: 'ambulance' });
ambulance_model_store_1.default.hasMany(shift_model_store_1.default, { foreignKey: 'ambulance_id', as: 'shifts' });
shift_model_store_1.default.belongsTo(user_model_store_1.default, { foreignKey: 'paramedical_id', as: 'paramedical' });
user_model_store_1.default.hasMany(shift_model_store_1.default, { foreignKey: 'paramedical_id', as: 'paramedicalShifts' });
shift_model_store_1.default.belongsTo(user_model_store_1.default, { foreignKey: 'driver_id', as: 'driver' });
user_model_store_1.default.hasMany(shift_model_store_1.default, { foreignKey: 'driver_id', as: 'driverShifts' });
shift_model_store_1.default.belongsTo(checklist_supply_model_store_1.default, { foreignKey: 'checklist_supply_id', as: 'checklistSupply' });
checklist_supply_model_store_1.default.hasOne(shift_model_store_1.default, { foreignKey: 'checklist_supply_id', as: 'shift' });
shift_model_store_1.default.belongsTo(checklist_ambulance_model_store_1.default, { foreignKey: 'checklist_ambulance_id', as: 'checklistAmbulance' });
checklist_ambulance_model_store_1.default.hasOne(shift_model_store_1.default, { foreignKey: 'checklist_ambulance_id', as: 'shift' });
// checklists
answer_model_store_1.default.belongsTo(question_model_store_1.default, { foreignKey: 'question_id', as: 'question' });
question_model_store_1.default.hasMany(answer_model_store_1.default, { foreignKey: 'question_id', as: 'answers' });
answer_model_store_1.default.belongsTo(checklist_ambulance_model_store_1.default, { foreignKey: 'checklist_ambulance_id', as: 'checklistAmbulance' });
checklist_ambulance_model_store_1.default.hasMany(answer_model_store_1.default, { foreignKey: 'checklist_ambulance_id', as: 'answers' });
answer_component_model_store_1.default.belongsTo(answer_model_store_1.default, { foreignKey: 'answer_id', as: 'answer' });
answer_model_store_1.default.hasMany(answer_component_model_store_1.default, { foreignKey: 'answer_id', as: 'components' });
