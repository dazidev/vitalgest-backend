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
  declare name: string;
  declare order: number;
}

QuestionCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "QuestionCategory",
    tableName: "question_categories",
    timestamps: true,
    underscored: true,
  },
);

export default QuestionCategory;
