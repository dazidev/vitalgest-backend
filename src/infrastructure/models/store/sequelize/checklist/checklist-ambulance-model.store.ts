import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';


class ChecklistAmbulance extends Model<
  InferAttributes<ChecklistAmbulance>,
  InferCreationAttributes<ChecklistAmbulance>
> {
  declare id: CreationOptional<string>

}

ChecklistAmbulance.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
  },
  {
    sequelize,
    modelName: 'ChecklistAmbulance',
    tableName: 'checklist_ambulances',
    timestamps: true,
    underscored: true,
    /*indexes: [
      { fields: ['shift_id'] },
    ],*/
    // paranoid: true //* activa borrado lógico
  },
);

export default ChecklistAmbulance;