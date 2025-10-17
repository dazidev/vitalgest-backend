import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';
import type State from './state-model.store';


class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare state_id: ForeignKey<State['id']>;

  declare state?: NonAttribute<State>;
}

Municipality.init(
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    state_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'states', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'RESTRICT', // impide eliminar al padre si tiene hijos
    }
  },
  {
    sequelize,
    modelName: 'Municipality',
    tableName: 'municipalities',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['state_id'] }],
    // paranoid: true //* activa borrado lógico
  },
);

export default Municipality;