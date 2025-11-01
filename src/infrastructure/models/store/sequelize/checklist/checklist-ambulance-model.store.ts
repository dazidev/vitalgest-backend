import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';
import Shift from '../shift-model.store';
import Ambulance from '../ambulance-model.store';


class ChecklistAmbulance extends Model<
  InferAttributes<ChecklistAmbulance>,
  InferCreationAttributes<ChecklistAmbulance>
> {
  declare id: CreationOptional<string>
  declare ambulance_id: ForeignKey<Ambulance['id']>
  declare shift_id: ForeignKey<Shift['id']>
  declare time: string
  declare km: number
  declare gas_path: string
  declare sign_operator_path: string
  declare sign_recipient_path: string
  declare notes?: string

  declare ambulance?: NonAttribute<Ambulance>
  declare shift?: NonAttribute<Shift>

}

ChecklistAmbulance.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    ambulance_id:{
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'ambulances', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    shift_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'shifts', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    time: { type: DataTypes.TIME, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIME') },
    km: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    gas_path: { type: DataTypes.STRING, allowNull: false },
    sign_operator_path: { type: DataTypes.STRING, allowNull: false },
    sign_recipient_path: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    sequelize,
    modelName: 'ChecklistAmbulance',
    tableName: 'checklist_ambulances',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['shift_id'] },
      { fields: ['ambulance_id'] },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default ChecklistAmbulance;