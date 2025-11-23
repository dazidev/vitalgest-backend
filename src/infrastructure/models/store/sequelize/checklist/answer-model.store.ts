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
import ChecklistAmbulance from "./checklist-ambulance-model.store";
import Question from "./question-model.store";

class Answer extends Model<
  InferAttributes<Answer>,
  InferCreationAttributes<Answer>
> {
  declare id: CreationOptional<string>;
  declare checklist_ambulance_id: ForeignKey<ChecklistAmbulance["id"]>;
  declare question_id: ForeignKey<Question["id"]>;
  declare checklist: NonAttribute<ChecklistAmbulance>;
  declare question: NonAttribute<Question>;
}

Answer.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },

    checklist_ambulance_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "checklist_ambulances", key: "id" },
      onUpdate: "CASCADE", // actualiza si el padre cambia de id
      onDelete: "CASCADE", // impide eliminar al padre si tiene hijos
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "questions", key: "id" },
      onUpdate: "CASCADE", // actualiza si el padre cambia de id
      onDelete: "CASCADE", // impide eliminar al padre si tiene hijos
    },
  },
  {
    sequelize,
    modelName: "Answer",
    tableName: "answers",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["checklist_ambulance_id"] },
      { fields: ["question_id"] },
      {
        unique: true,
        fields: ["checklist_ambulance_id", "question_id"],
        name: "uq_question_response",
      },
    ],
  }
);

export default Answer;
