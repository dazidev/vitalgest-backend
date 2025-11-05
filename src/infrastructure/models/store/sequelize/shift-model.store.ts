import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import Guard from './guard-model.store';
import User from './user-model.store';
import ChecklistSupply from './checklist/checklist-supply-model.store';
import ChecklistAmbulance from './checklist/checklist-ambulance-model.store';
import Ambulance from './ambulance-model.store';


class Shift extends Model<
  InferAttributes<Shift>,
  InferCreationAttributes<Shift>
> {
  declare id: CreationOptional<string>

  declare name: string

  declare ambulance_id: ForeignKey<Ambulance['id']>
  declare ambulance?: NonAttribute<Ambulance>

  declare guard_id: ForeignKey<Guard['id']>
  declare guard?: NonAttribute<Guard>

  declare paramedical_id: ForeignKey<User['id']>
  declare paramedical?: NonAttribute<User>

  declare driver_id: ForeignKey<User['id']>
  declare driver?: NonAttribute<User>

  declare checklist_supply_id: ForeignKey<ChecklistSupply['id']>
  declare checklistSupply?: NonAttribute<ChecklistSupply>

  declare checklist_ambulance_id: ForeignKey<ChecklistAmbulance['id']>
  declare checklistAmbulance?: NonAttribute<ChecklistAmbulance>
}

Shift.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },

    ambulance_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'ambulances', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'CASCADE', // elimina los hijos
    },
    guard_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'guards', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'CASCADE', // elimina los hijos
    },
    paramedical_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    driver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    checklist_supply_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'checklist_supplies', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    checklist_ambulance_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'checklist_ambulances', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: 'Shift',
    tableName: 'shifts',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['guard_id'] },
      { fields: ['ambulance_id'] },
      { fields: ['paramedical_id'] },
      { fields: ['driver_id'] },
      { fields: ['checklist_supply_id'] },
      { fields: ['checklist_ambulance_id'] },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default Shift;