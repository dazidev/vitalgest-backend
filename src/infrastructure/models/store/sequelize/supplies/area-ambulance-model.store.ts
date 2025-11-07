import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';


class AreaAmbulance extends Model<
  InferAttributes<AreaAmbulance>,
  InferCreationAttributes<AreaAmbulance>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare section: string
  declare order: number
}

AreaAmbulance.init(
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    section: { type: DataTypes.STRING(100), allowNull: false },
    order: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
  },
  {
    sequelize,
    modelName: 'AreaAmbulance',
    tableName: 'areas_ambulance',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['order'] },
    ]
    // paranoid: true //* activa borrado lógico
  },
);

export default AreaAmbulance;