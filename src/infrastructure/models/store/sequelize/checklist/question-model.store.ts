import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
} from "sequelize";
import { sequelize } from "../../../../config/sequelize.adapter";

// const RESPONSE_STATES = ['BUENO','REGULAR','MALO'] as const;

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
  declare name_category: string;
  declare order_category: number;
  declare order_question_category: number;
  declare name_subcategory: CreationOptional<string | null>;
  declare order_subcategory: CreationOptional<number | null>;
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
    question: { type: DataTypes.STRING, allowNull: false },
    name_category: { type: DataTypes.STRING, allowNull: false },
    order_category: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    order_question_category: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name_subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    order_subcategory: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
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
  }
);

export default Question;
