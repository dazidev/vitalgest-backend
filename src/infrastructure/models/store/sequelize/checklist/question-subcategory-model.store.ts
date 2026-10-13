import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
} from "sequelize";
import { sequelize } from "../../../../config/sequelize.adapter";
import QuestionCategory from "./question-category-model.store";

class QuestionSubcategory extends Model<
  InferAttributes<QuestionSubcategory>,
  InferCreationAttributes<QuestionSubcategory>
> {
  declare id: CreationOptional<string>;
  declare category_id: ForeignKey<QuestionCategory["id"]>;
  declare name: string;
  declare order: number;
}

QuestionSubcategory.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "question_categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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
    modelName: "QuestionSubcategory",
    tableName: "question_subcategories",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["category_id", "order"],
      },
      {
        unique: true,
        fields: ["category_id", "name"],
      },
    ],
  },
);

export default QuestionSubcategory;
