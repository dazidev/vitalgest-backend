import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';
import Answer from './answer-model.store';

const ANSWER_TYPES = ["bool", "option", "text", "bool_option", "bool_text", "option_text", "bool_option_text"] as const
type AnswerTypes = typeof ANSWER_TYPES[number]

class AnswerComponent extends Model<
  InferAttributes<AnswerComponent>,
  InferCreationAttributes<AnswerComponent>
> {
  declare id: CreationOptional<string>
  declare answer_id: ForeignKey<Answer['id']>

  declare type: AnswerTypes

  declare value_bool: CreationOptional<boolean | null>
  declare value_option: CreationOptional<string | null>
  declare value_text: CreationOptional<string | null>


  declare answer: NonAttribute<Answer>
}

AnswerComponent.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    answer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'answers', key: 'id' },
      onUpdate: 'CASCADE', // actualiza si el padre cambia de id
      onDelete: 'CASCADE', // impide eliminar al padre si tiene hijos
    },
    type: {
      type: DataTypes.ENUM(...ANSWER_TYPES),
      allowNull: false,
    },
    value_bool: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
    value_option: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    value_text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'AnswerComponent',
    tableName: 'answer_component',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['answer_id'], name: 'uq_answer' },
    ],
  },
);

export default AnswerComponent;