import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../config/sequelize.adapter';


class User extends Model<
  InferAttributes<User>,          // lo que tiene una fila ya persistida
  InferCreationAttributes<User>   // lo que es requerido para crear
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare lastname: string;
  declare email: string;
  declare password: string;
  declare status: boolean;
  declare role: string;
  declare position: string;
  declare delegation_id: string;

}

User.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    lastname: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false },
    role: { type: DataTypes.STRING(100), allowNull: false },
    position: { type: DataTypes.STRING(100), allowNull: false },
    delegation_id: { type: DataTypes.UUID, allowNull: false }, //todo: realizar la referencia
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
  },
);

export default User;