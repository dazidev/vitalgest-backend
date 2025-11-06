import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import type Municipality from './municipality-model.store';


class Delegation extends Model<
  InferAttributes<Delegation>,
  InferCreationAttributes<Delegation>
> {
  declare id: CreationOptional<string>
  declare name: string
  declare municipality_id: ForeignKey<Municipality['id']>
  declare municipality?: NonAttribute<Municipality>
}

Delegation.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    municipality_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'municipalities', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: 'Delegation',
    tableName: 'delegations',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['municipality_id'],
        name: 'uq_delegations_municipality',
      },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default Delegation;