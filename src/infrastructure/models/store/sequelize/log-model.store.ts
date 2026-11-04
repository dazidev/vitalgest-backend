import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  UUIDV4,
} from "sequelize";

import { sequelize } from "../../../config/sequelize.adapter";
import User from "./user-model.store";

class Log extends Model<InferAttributes<Log>, InferCreationAttributes<Log>> {
  declare id: CreationOptional<string>;

  declare user_id: ForeignKey<User["id"]> | null;
  declare affected: string | null;
  declare entity: string;
  declare action: string;
  declare description: string;

  declare createdAt: CreationOptional<Date>;

  declare user?: NonAttribute<User | null>;
}

Log.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    affected: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    entity: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Log",
    tableName: "server_log",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["entity", "action"] },
      { fields: ["created_at"] },
    ],
  },
);

export default Log;
