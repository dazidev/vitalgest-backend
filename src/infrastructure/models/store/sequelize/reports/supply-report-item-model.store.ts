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
import SupplyReport from "./supply-report-model.store";

class SupplyReportItem extends Model<
  InferAttributes<SupplyReportItem>,
  InferCreationAttributes<SupplyReportItem>
> {
  declare id: CreationOptional<string>;

  declare report_id: ForeignKey<SupplyReport["id"]>;

  declare category: string;
  declare specification?: string | null;
  declare measurement_unit: string;

  declare min_quantity: number;
  declare reported_quantity: number;
  declare required_quantity: number;
  declare added_quantity: CreationOptional<number>;

  declare is_resolved: CreationOptional<boolean>;

  declare area_id: number;
  declare area_name: string;
  declare section: string;
  declare area_order: number;

  declare report?: NonAttribute<SupplyReport>;
}

SupplyReportItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    report_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "supply_reports", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    measurement_unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    min_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    reported_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    required_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    added_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    is_resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    area_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    area_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    area_order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SupplyReportItem",
    tableName: "supply_report_items",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["report_id"] }],
  },
);

export default SupplyReportItem;
