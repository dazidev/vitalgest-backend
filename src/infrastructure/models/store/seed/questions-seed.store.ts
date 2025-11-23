import { Transaction } from "sequelize";
import { sequelize } from "../../../config/sequelize.adapter";
import { Question } from "../models.store";

enum CATEGORIES {
  C1 = "Apariencia general",

  C2 = "Compartimiento del operador",
  C2_S1 = "Documentación",
  C2_S2 = "Aditamientos",

  C3 = "Compartimiento del motor",
  C3_S1 = "Parámetros de niveles",

  C4 = "Recorrido exterior lado del aperador",
  C5 = "Recorrido exterior frente",
  C6 = "Recorrido exterior lado del copiloto",
  C7 = "Compartimiento del paciente",
  C8 = "Recorrido exterior posterior",
  C9 = "Herramienta y aditamentos",
}

enum TYPE_RESPONSES {
  BOOL = "bool",
  OPTION = "option",
  TEXT = "text",
  BOOL_OPTION = "bool_option",
  BOOL_TEXT = "bool_text",
  OPTION_TEXT = "option_text",
  BOOL_OPTION_TEXT = "bool_option_text",
}

export const createQuestionsSeed = async () => {
  let tx: Transaction | undefined;

  try {
    tx = await sequelize.transaction();

    //* Apariencia general (1)
    await Question.bulkCreate(
      [
        {
          question: "Limpieza de la unidad",
          name_category: CATEGORIES.C1,
          order_category: 1,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Fuga de niveles",
          name_category: CATEGORIES.C1,
          order_category: 1,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Daños a la carroceria",
          name_category: CATEGORIES.C1,
          order_category: 1,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL,
        },
      ],
      { transaction: tx }
    );

    //* Compartimiento del operador (2)
    await Question.bulkCreate(
      [
        {
          question: "Checklist",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Objetos no asegurados",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Ajuste de asiento",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Cinturón de seguridad",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Ajuste de espejos",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Licencia de conducir",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 6,
          name_subcategory: CATEGORIES.C2_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Poliza de seguro",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 7,
          name_subcategory: CATEGORIES.C2_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "FRAPS",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 8,
          name_subcategory: CATEGORIES.C2_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Manual de vehículo",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 9,
          name_subcategory: CATEGORIES.C2_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Lámpara de mano",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 10,
          name_subcategory: CATEGORIES.C2_S2,
          order_subcategory: 2,
          type_response: TYPE_RESPONSES.BOOL,
        },
        {
          question: "Guiaroji y/o GPS",
          name_category: CATEGORIES.C2,
          order_category: 2,
          order_question_category: 11,
          name_subcategory: CATEGORIES.C2_S2,
          order_subcategory: 2,
          type_response: TYPE_RESPONSES.BOOL,
        },
      ],
      { transaction: tx }
    );

    //* Comportamiento del motor (3)
    await Question.bulkCreate(
      [
        {
          question: "Señal de fugas",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Cables sueltos",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Acumulador",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 3,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
        {
          question: "Aceite de motor",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 4,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
        {
          question: "Aceite de transmisión",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 5,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
        {
          question: "Aceite de dirección",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 6,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
        {
          question: "Líquido de frenos",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 7,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
        {
          question: "Anticongelante",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 8,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
        {
          question: "Liquido de limpiabrisas",
          name_category: CATEGORIES.C3,
          order_category: 3,
          order_question_category: 9,
          name_subcategory: CATEGORIES.C3_S1,
          order_subcategory: 1,
          type_response: TYPE_RESPONSES.OPTION,
        },
      ],
      { transaction: tx }
    );

    //* Recorrido exterior lado del aperador (4)
    await Question.bulkCreate(
      [
        {
          question: "Luces laterales de emergencia",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Base del espejo lateral",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Ventana del operador",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Goma de la pluma del limpiaparabrisas",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luz de navegación",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Llanta (inflado y apariencia)",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 6,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Defensa lateral",
          name_category: CATEGORIES.C4,
          order_category: 4,
          order_question_category: 7,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
      ],
      { transaction: tx }
    );

    //* Recorrido exterior frente (5)
    await Question.bulkCreate(
      [
        {
          question: "Torreta",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luces frontales de emergencia",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Parabrisas",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Busca ruidos o anomalias",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luces generales, alta y baja",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Intermitentes",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 6,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Direccionales",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 7,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Parrilla de la unidad",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 8,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luces frontales de navegación",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 9,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Defensa delantera",
          name_category: CATEGORIES.C5,
          order_category: 5,
          order_question_category: 10,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
      ],
      { transaction: tx }
    );

    //* Recorrido exterior lado del copiloto (6)
    await Question.bulkCreate(
      [
        {
          question: "Luces laterales de emergencia",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Base del espejo lateral",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Ventana del operador",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Goma de la pluma del limpiaparabrisas",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luz de navegación",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "LLanta (inflado y apariencia)",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 6,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Defensa lateral",
          name_category: CATEGORIES.C6,
          order_category: 6,
          order_question_category: 7,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
      ],
      { transaction: tx }
    );

    //* Compartimiento del paciente (7)
    await Question.bulkCreate(
      [
        {
          question: "Luces de paso",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luz módulo de atención",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Aspirador Amb.",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Gavetas",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Camilla marina",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Camilla rigida",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 6,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Carro camilla",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 7,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Spiders",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 8,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Sujetadores",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 9,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Oxígeno central",
          name_category: CATEGORIES.C7,
          order_category: 7,
          order_question_category: 10,
          type_response: TYPE_RESPONSES.BOOL_TEXT,
        },
      ],
      { transaction: tx }
    );

    //* Recorrido exterior posterior (8)
    await Question.bulkCreate(
      [
        {
          question: "Barra de tráfico",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luces de emergencia",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luces de reversa",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Luces de alto",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Direccional",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Intermitentes",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 6,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Ventanas",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 7,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Defensa trasera",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 8,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Llanta de refacción",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 9,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "LLanta izquierda (inflado y apariencia)",
          name_category: CATEGORIES.C8,
          order_category: 8,
          order_question_category: 10,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
      ],
      { transaction: tx }
    );

    //* Herramienta y aditamentos (9)
    await Question.bulkCreate(
      [
        {
          question: "Gato hidráulico",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 1,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Llave de cruz",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 2,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Extintor",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 3,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Triangulos reflejantes",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 4,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Conos (5)",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 5,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Cables pasa corriente",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 6,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
        {
          question: "Kit de herramientas",
          name_category: CATEGORIES.C9,
          order_category: 9,
          order_question_category: 7,
          type_response: TYPE_RESPONSES.BOOL_OPTION,
        },
      ],
      { transaction: tx }
    );

    await tx.commit();

    return { success: true };
  } catch (error) {
    await tx?.rollback();
    console.log(error);
    throw { success: false };
  }
};
