import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import Delegation from './delegation-model.store';


class Pharmacy extends Model<
  InferAttributes<Pharmacy>,
  InferCreationAttributes<Pharmacy>
> {
  declare id: CreationOptional<string>

  declare delegation_id: ForeignKey<Delegation['id']>
  declare delegation?: NonAttribute<Delegation>
}

Pharmacy.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    delegation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'delegations', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'CASCADE', // impide eliminar al padre si tiene hijos
    }
  },
  {
    sequelize,
    modelName: 'Pharmacy',
    tableName: 'pharmacies',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
    indexes: [
      { unique: true, fields: ['delegation_id'], name: 'uq_delegation' }
    ]
  },
);

export default Pharmacy;