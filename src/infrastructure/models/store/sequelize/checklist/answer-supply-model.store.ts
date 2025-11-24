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
import { sequelize } from "../../../../config/sequelize.adapter";
import ChecklistSupply from "./checklist-supply-model.store";
import AreaAmbulance from "../supplies/area-ambulance-model.store";

class AnswerSupply extends Model<
  InferAttributes<AnswerSupply>,
  InferCreationAttributes<AnswerSupply>
> {
  declare id: CreationOptional<string>;
  declare checklist_id: ForeignKey<ChecklistSupply["id"]>;
  declare category: string;
  declare specification?: string;
  declare avaible_quantity: number;
  declare min_quantity: number;
  declare required_quantity: number;
  declare measurement_unit: string;

  declare area_id: ForeignKey<AreaAmbulance["id"]>;

  declare area?: NonAttribute<AreaAmbulance>;
  declare checklist?: NonAttribute<ChecklistSupply>;
}

AnswerSupply.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    checklist_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "checklist_supplies", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    category: { type: DataTypes.STRING, allowNull: false },
    specification: { type: DataTypes.STRING, allowNull: true },
    avaible_quantity: { type: DataTypes.INTEGER, allowNull: false },
    min_quantity: { type: DataTypes.INTEGER, allowNull: false },
    required_quantity: { type: DataTypes.INTEGER, allowNull: false },
    measurement_unit: { type: DataTypes.STRING, allowNull: false },
    area_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: "areas_ambulance", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "AnswerSupply",
    tableName: "answers_supplies",
    timestamps: true,
    underscored: true,
    // paranoid: true //* activa borrado lógico
  }
);

export default AnswerSupply;
