import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
} from "sequelize";
import { sequelize } from "../../../../config/sequelize.adapter";

class QuestionCategory extends Model<
  InferAttributes<QuestionCategory>,
  InferCreationAttributes<QuestionCategory>
> {
  declare id: CreationOptional<string>;
  declare delegation_id: string;

  toJSON(): any {
    const values = { ...this.get({ plain: true }) };
    delete (values as Partial<typeof values>).delegation_id;
    return values;
  }
  declare name: string;
  declare order: number;
}

QuestionCategory.init(
  {
    delegation_id: {
      type: DataTypes.UUID, allowNull: false,
      references: { model: "delegations", key: "id" },
      onUpdate: "CASCADE", onDelete: "CASCADE",
    },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "QuestionCategory",
    tableName: "question_categories",
    indexes: [
      { unique: true, fields: ["delegation_id", "name"] },
      { unique: true, fields: ["delegation_id", "order"] },
    ],
    timestamps: true,
    underscored: true,
  },
);

export default QuestionCategory;
