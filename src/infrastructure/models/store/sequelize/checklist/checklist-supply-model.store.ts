import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';


class ChecklistSupply extends Model<
  InferAttributes<ChecklistSupply>,
  InferCreationAttributes<ChecklistSupply>
> {
  declare id: CreationOptional<string>

}

ChecklistSupply.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
  },
  {
    sequelize,
    modelName: 'ChecklistSupply',
    tableName: 'checklist_supplies',
    timestamps: true,
    underscored: true,
    /*indexes: [
      { fields: ['shift_id'] },
    ],*/
    // paranoid: true //* activa borrado lógico
  },
);

export default ChecklistSupply;