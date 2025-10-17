import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';


class Pharmacy extends Model<
  InferAttributes<Pharmacy>,
  InferCreationAttributes<Pharmacy>
> {
  declare id: CreationOptional<number>;
}

Pharmacy.init(
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
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