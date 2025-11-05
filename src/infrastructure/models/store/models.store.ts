// Modelos sequelize
import Delegation from "./sequelize/delegation-model.store";
import Guard from "./sequelize/guard-model.store";
import Municipality from "./sequelize/municipality-model.store";
import Pharmacy from "./sequelize/pharmacy-model.store";
import State from "./sequelize/state-model.store";
import User from './sequelize/user-model.store';
import Ambulance from './sequelize/ambulance-model.store';
import Shift from "./sequelize/shift-model.store";
import ChecklistSupply from './sequelize/checklist/checklist-supply-model.store';
import ChecklistAmbulance from './sequelize/checklist/checklist-ambulance-model.store';
import Question from './sequelize/checklist/question-model.store';
import Answer from "./sequelize/checklist/answer-model.store";
import AnswerComponent from "./sequelize/checklist/answer-component-model.store";
import Supply from "./sequelize/supplies/supply-model.store";
import SupplyAmbulance from "./sequelize/supplies/supply-ambulance-model.store";


// Definicion de asociaciones 
State.hasMany(Municipality, { foreignKey: 'state_id', as: 'municipalities' });
Municipality.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

State.hasMany(Delegation, { foreignKey: 'state_id', as: 'delegations' });
Municipality.hasMany(Delegation, { foreignKey: 'municipality_id', as: 'delegations' });
Pharmacy.hasMany(Delegation, { foreignKey: 'pharmacy_id', as: 'delegations' });

Delegation.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Delegation.belongsTo(Municipality, { foreignKey: 'municipality_id', as: 'municipality' });
Delegation.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' });

Guard.belongsTo(User, { foreignKey: 'guard_chief', as: 'guardChief' });
User.hasMany(Guard, { foreignKey: 'guard_chief', as: 'guardsAsChief' });

Guard.belongsTo(Delegation, { foreignKey: 'delegation_id', as: 'delegation' });
Delegation.hasMany(Guard, { foreignKey: 'delegation_id', as: 'guards' });

// Ambulancias
Ambulance.belongsTo(Delegation, { foreignKey: 'delegation_id', as: 'delegation' })
Delegation.hasMany(Ambulance, { foreignKey: 'delegation_id', as: 'ambulances' })

// Turnos
Shift.belongsTo(Guard, { foreignKey: 'guard_id', as: 'guard' })
Guard.hasMany(Shift, { foreignKey: 'guard_id', as: 'shifts' })

Shift.belongsTo(Ambulance, { foreignKey: 'ambulance_id', as: 'ambulance' });
Ambulance.hasMany(Shift,   { foreignKey: 'ambulance_id', as: 'ambulanceShifts' });

Shift.belongsTo(User, { foreignKey: 'paramedical_id', as: 'paramedical' });
User.hasMany(Shift,   { foreignKey: 'paramedical_id', as: 'paramedicalShifts' });

Shift.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });
User.hasMany(Shift,   { foreignKey: 'driver_id', as: 'driverShifts' });

// checklists
ChecklistAmbulance.belongsTo(Ambulance, { foreignKey: 'ambulance_id', as: 'ambulance' })
Ambulance.hasMany(ChecklistAmbulance, { foreignKey: 'ambulance_id', as: 'checklists' })

ChecklistAmbulance.belongsTo(Shift, { foreignKey: 'shift_id', as: 'shift' })
Shift.hasMany(ChecklistAmbulance, { foreignKey: 'shift_id', as: 'checklists' })

Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' })
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' })

Answer.belongsTo(ChecklistAmbulance, { foreignKey: 'checklist_ambulance_id', as: 'checklistAmbulance' })
ChecklistAmbulance.hasMany(Answer, { foreignKey: 'checklist_ambulance_id', as: 'answers' })

AnswerComponent.belongsTo(Answer, { foreignKey: 'answer_id', as: 'answer' })
Answer.hasOne(AnswerComponent, { foreignKey: 'answer_id', as: 'components' }) //! solo una.

// insumos
Supply.belongsTo(Pharmacy, { foreignKey: 'pharmacy_id', as: 'pharmacy' })
Pharmacy.hasMany(Supply, { foreignKey: 'pharmacy_id', as: 'supplies' })

SupplyAmbulance.belongsTo(Supply, { foreignKey: 'supply_id', as: 'supply' })
Supply.hasMany(SupplyAmbulance, { foreignKey: 'supply_id', as: 'ambulanceSupplies' })

SupplyAmbulance.belongsTo(Ambulance, { foreignKey: 'ambulance_id', as: 'ambulance' })
Ambulance.hasMany(SupplyAmbulance, { foreignKey: 'ambulance_id', as: 'supplies' })




// desde aca se debe hacer las importaciones
export { 
  State,
  Municipality,
  Pharmacy,
  Delegation,
  User,
  Guard,
  Ambulance,
  Shift,
  ChecklistAmbulance,
  ChecklistSupply,
  Question,
  Answer,
  AnswerComponent,
  Supply,
  SupplyAmbulance
};