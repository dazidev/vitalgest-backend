import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';

// const RESPONSE_STATES = ['BUENO','REGULAR','MALO'] as const;


class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: CreationOptional<string>
  declare question: string
  declare name_category: string
  declare order_category: number
  declare order_question_category: number
  declare name_subcategory: CreationOptional<string | null>
  declare order_subcategory: CreationOptional<number | null>
  declare boolean_response: CreationOptional<boolean>
  declare enum_response: CreationOptional<boolean>
  declare free_response: CreationOptional<boolean>
}

Question.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    question: { type: DataTypes.STRING, allowNull: false },
    name_category: { type: DataTypes.STRING, allowNull: false },
    order_category: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    order_question_category: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name_subcategory: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    order_subcategory: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
    boolean_response: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    enum_response: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    free_response: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
    timestamps: true,
    underscored: true,
  },
);

export default Question;