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
import QuestionCategory from "./question-category-model.store";
import QuestionSubcategory from "./question-subcategory-model.store";

const TYPE_RESPONSES = [
  "bool",
  "option",
  "text",
  "bool_option",
  "bool_text",
  "option_text",
  "bool_option_text",
] as const;

type TypeResponse = (typeof TYPE_RESPONSES)[number];

class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: CreationOptional<string>;
  declare question: string;

  declare category_id: ForeignKey<QuestionCategory["id"]>;
  declare subcategory_id: ForeignKey<QuestionSubcategory["id"]> | null;

  declare category?: NonAttribute<QuestionCategory>;
  declare subcategory?: NonAttribute<QuestionSubcategory | null>;

  declare order_question_category: number;
  declare type_response: TypeResponse;
}

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
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
    subcategory_id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "question_subcategories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    order_question_category: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    type_response: {
      type: DataTypes.ENUM(...TYPE_RESPONSES),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["category_id"] },
      { fields: ["subcategory_id"] },
      {
        fields: ["category_id", "subcategory_id", "order_question_category"],
      },
    ],
  },
);

export default Question;
