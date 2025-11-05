import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';


class Pharmacy extends Model<
  InferAttributes<Pharmacy>,
  InferCreationAttributes<Pharmacy>
> {
  declare id: CreationOptional<string>;
}

Pharmacy.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Pharmacy',
    tableName: 'pharmacies',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
  },
);

export default Pharmacy;