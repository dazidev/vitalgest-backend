import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import Delegation from './delegation-model.store';


class Ambulance extends Model<
  InferAttributes<Ambulance>,
  InferCreationAttributes<Ambulance>
> {
  declare id: CreationOptional<string>;
  declare number: string
  declare brand: string
  declare model: string

  declare delegation_id: ForeignKey<Delegation['id']>;
  declare delegation?: NonAttribute<Delegation>;
}

Ambulance.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    number: { type: DataTypes.STRING(100), allowNull: false, /*unique: true*/ },
    brand: { type: DataTypes.STRING(100), allowNull: false },
    model: { type: DataTypes.STRING(100), allowNull: false },
    delegation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'delegations', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      //onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: 'Ambulance',
    tableName: 'ambulances',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['number'], name: 'uq_ambulances_number' },
      { fields: ['delegation_id'] },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default Ambulance;