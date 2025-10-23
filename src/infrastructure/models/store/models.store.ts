// modelos sequelize
import Delegation from "./sequelize/delegation-model.store";
import Guard from "./sequelize/guard-model.store";
import Municipality from "./sequelize/municipality-model.store";
import Pharmacy from "./sequelize/pharmacy-model.store";
import State from "./sequelize/state-model.store";
import User from './sequelize/user-model.store';
import Ambulance from './sequelize/ambulance-model.store';


// Definicion de asociaciones 
State.hasMany(Municipality,  { foreignKey: 'state_id', as: 'municipalities' });
Municipality.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

State.hasMany(Delegation,     { foreignKey: 'state_id', as: 'delegations' });
Municipality.hasMany(Delegation,{ foreignKey: 'municipality_id', as: 'delegations' });
Pharmacy.hasMany(Delegation,  { foreignKey: 'pharmacy_id', as: 'delegations' });

Delegation.belongsTo(State,        { foreignKey: 'state_id',        as: 'state' });
Delegation.belongsTo(Municipality, { foreignKey: 'municipality_id', as: 'municipality' });
Delegation.belongsTo(Pharmacy,     { foreignKey: 'pharmacy_id',     as: 'pharmacy' });

Guard.belongsTo(User, { foreignKey: 'guard_chief', as: 'guardChief' });
User.hasMany(Guard,   { foreignKey: 'guard_chief', as: 'guardsAsChief' });

Guard.belongsTo(Delegation, { foreignKey: 'delegation_id', as: 'delegation' });
Delegation.hasMany(Guard,   { foreignKey: 'delegation_id', as: 'guards' });

// ambulancias
Ambulance.belongsTo(Delegation, { foreignKey: 'delegation_id', as: 'delegation' })
Delegation.hasMany(Ambulance, { foreignKey: 'delegation_id', as: 'ambulances' })

// desde aca se debe hacer las importaciones
export { State, Municipality, Pharmacy, Delegation, User, Guard, Ambulance };