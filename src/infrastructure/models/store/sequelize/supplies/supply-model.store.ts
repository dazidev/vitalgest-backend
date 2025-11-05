import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import Pharmacy from '../pharmacy-model.store';
import { sequelize } from '../../../../config/sequelize.adapter';



class Supply extends Model<
  InferAttributes<Supply>,
  InferCreationAttributes<Supply>
> {
  declare id: CreationOptional<string>
  declare category: string
  declare specification: string
  declare measurement_unit: string
  declare min_quantity: number
  declare avaible_quantity: number
  declare expiration_date: Date
  

  declare pharmacy_id: ForeignKey<Pharmacy['id']>;
  declare pharmacy?: NonAttribute<Pharmacy>;
}

Supply.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    specification: { type: DataTypes.STRING, allowNull: false },
    measurement_unit: { type: DataTypes.STRING, allowNull: false },
    min_quantity: { type: DataTypes.INTEGER, allowNull: false },
    avaible_quantity: { type: DataTypes.INTEGER, allowNull: false },
    expiration_date: { type: DataTypes.DATE, allowNull: false },
    pharmacy_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'pharmacies', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: 'Supply',
    tableName: 'supplies',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['pharmacy_id'] },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default Supply;