import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import type State from './state-model.store';
import type Municipality from './municipality-model.store';
import type Pharmacy from './pharmacy-model.store';


class Delegation extends Model<
  InferAttributes<Delegation>,
  InferCreationAttributes<Delegation>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare state_id: ForeignKey<State['id']>;
  declare municipality_id: ForeignKey<Municipality['id']>;
  declare pharmacy_id: ForeignKey<Pharmacy['id']>;

  declare state?: NonAttribute<State>;
  declare municipality?: NonAttribute<Municipality>;
  declare pharmacy?: NonAttribute<Pharmacy>;
}

Delegation.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    state_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'states', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    municipality_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'municipalities', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    },
    pharmacy_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'pharmacies', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    }
  },
  {
    sequelize,
    modelName: 'Delegation',
    tableName: 'delegations',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['state_id'] },
      { fields: ['municipality_id'] },
      { fields: ['pharmacy_id'] },
      { unique: true, fields: ['state_id', 'municipality_id', 'pharmacy_id'], name: 'uq_delegation_triple' },
    ],
    // paranoid: true //* activa borrado lógico
  },
);

export default Delegation;