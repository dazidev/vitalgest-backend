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
import ChecklistSupply from "../checklist/checklist-supply-model.store";
import Ambulance from "../ambulance-model.store";

class SupplyReport extends Model<
  InferAttributes<SupplyReport>,
  InferCreationAttributes<SupplyReport>
> {
  declare id: CreationOptional<string>;

  declare checklist_id: ForeignKey<ChecklistSupply["id"]>;
  declare ambulance_id: ForeignKey<Ambulance["id"]>;

  declare status: CreationOptional<"pending" | "attended">;
  declare attended_at?: Date | null;

  declare checklist?: NonAttribute<ChecklistSupply>;
  declare ambulance?: NonAttribute<Ambulance>;
}

SupplyReport.init(
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
      onDelete: "RESTRICT",
    },
    ambulance_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "ambulances", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    status: {
      type: DataTypes.ENUM("pending", "attended"),
      allowNull: false,
      defaultValue: "pending",
    },
    attended_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "SupplyReport",
    tableName: "supply_reports",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["checklist_id"],
      },
      { fields: ["ambulance_id"] },
      { fields: ["status"] },
    ],
  },
);

export default SupplyReport;
