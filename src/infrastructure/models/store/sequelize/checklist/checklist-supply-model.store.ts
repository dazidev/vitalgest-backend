import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';
import Shift from '../shift-model.store';
import Ambulance from '../ambulance-model.store';


class ChecklistSupply extends Model<
  InferAttributes<ChecklistSupply>,
  InferCreationAttributes<ChecklistSupply>
> {
  declare id: CreationOptional<string>
  declare ambulance_id: ForeignKey<Ambulance['id']>
  declare shift_id: ForeignKey<Shift['id']>

  declare ambulance?: NonAttribute<Ambulance>
  declare shift?: NonAttribute<Shift>
}

ChecklistSupply.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    ambulance_id: {
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
  },

  {
    sequelize,
    modelName: 'ChecklistSupply',
    tableName: 'checklist_supplies',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['ambulance_id'] },
      {
        unique: true,
        fields: ['shift_id'],
        name: 'checklist_supplies_shift_id',
      },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default ChecklistSupply;