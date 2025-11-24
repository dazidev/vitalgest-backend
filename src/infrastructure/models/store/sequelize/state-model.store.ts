import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/sequelize.adapter";

class State extends Model<
  InferAttributes<State>,
  InferCreationAttributes<State>
> {
  declare id: CreationOptional<number>;
  declare name: string;
}

State.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "State",
    tableName: "states",
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
  }
);

export default State;
