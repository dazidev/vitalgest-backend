import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { sequelize } from '../../../../config/sequelize.adapter';

//* type ResponseState = 'BUENO' | 'REGULAR' | 'MALO'

class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: CreationOptional<string>
  declare question: string
  declare name_category: string
  declare order_category: number
  declare name_subcategory: string
  declare order_subcategory: number
  declare boolean_response: boolean
  declare emun_response: boolean
  declare free_response: boolean
}

Question.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4, allowNull: false },
    question: { type: DataTypes.STRING, allowNull: false },
    name_category : { type: DataTypes.STRING, allowNull: false },
    order_category : { type: DataTypes.NUMBER, allowNull: false },
    name_subcategory : { type: DataTypes.STRING, allowNull: false },
    order_subcategory : { type: DataTypes.NUMBER, allowNull: false },
    boolean_response : { type: DataTypes.BOOLEAN, defaultValue: false  },
    emun_response : { type: DataTypes.BOOLEAN, defaultValue: false },
    free_response : { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
    timestamps: true,
    underscored: true,
    /*indexes: [
      { fields: ['shift_id'] },
    ],*/
    // paranoid: true //* activa borrado lógico
  },
);

export default Question;