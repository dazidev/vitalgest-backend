import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import type User from './user-model.store';
import type Delegation from './delegation-model.store';


class Guard extends Model<
  InferAttributes<Guard>,
  InferCreationAttributes<Guard>
> {
  declare id: CreationOptional<string>;
  declare date: Date;

  declare guard_chief: ForeignKey<User['id']>;
  declare delegation_id: ForeignKey<Delegation['id']>;


  declare guardChief?: NonAttribute<User>;
  declare delegation?: NonAttribute<Delegation>;
}

Guard.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    guard_chief: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    delegation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'delegations', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: 'Guard',
    tableName: 'guards',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['guard_chief'] },
      { fields: ['delegation_id'] },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default Guard;