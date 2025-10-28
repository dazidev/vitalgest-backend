import { Transaction } from "sequelize"
import { sequelize } from "../../../config/sequelize.adapter"
import { Question } from "../models.store"

enum CATEGORIES {
  C1 = 'Apariencia general',

  C2 = 'Compartimiento del operador',
  C2_S1 = 'Documentación',
  C2_S2 = 'Aditamientos',

  C3 = 'Compartimiento del motor',
  C3_S1 = 'Parámetros de niveles',

  C4 = 'Recorrido exterior lado del aperador',
  C5 = 'Recorrido exterior frente',
  C6 = 'Recorrido exterior lado del copiloto',
  C7 = 'Compartimiento del paciente',
  C8 = 'Recorrido exterior posterior',
  C9 = 'Herramienta y aditamentos'
}


export const createQuestionsSeed = async () => {
  let tx: Transaction | undefined

  try {
    tx = await sequelize.transaction()

    //* Apariencia general (1)
    await Question.bulkCreate([
      { 
        question: 'Limpieza de la unidad',
        name_category: CATEGORIES.C1,
        order_category: 1,
        order_question_category: 1,
        boolean_response: true  
      },
      { 
        question: 'Fuga de niveles',
        name_category: CATEGORIES.C1,
        order_category: 1,
        order_question_category: 2,
        boolean_response: true  
      },
      { 
        question: 'Daños a la carroceria',
        name_category: CATEGORIES.C1,
        order_category: 1,
        order_question_category: 3,
        boolean_response: true  
      },
    ], { transaction: tx })

    //* Compartimiento del operador (2)
    await Question.bulkCreate([
      { 
        question: 'Checklist',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 1,
        boolean_response: true  
      },
      { 
        question: 'Objetos no asegurados',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 2,
        boolean_response: true  
      },
      { 
        question: 'Ajuste de asiento',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 3,
        boolean_response: true  
      },
      { 
        question: 'Cinturón de seguridad',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 4,
        boolean_response: true  
      },
      { 
        question: 'Ajuste de espejos',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 5,
        boolean_response: true  
      },
      { 
        question: 'Licencia de conducir',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 6,
        name_subcategory: CATEGORIES.C2_S1,
        order_subcategory: 1,
        boolean_response: true  
      },
      { 
        question: 'Poliza de seguro',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 7,
        name_subcategory: CATEGORIES.C2_S1,
        order_subcategory: 1,
        boolean_response: true  
      },
      { 
        question: 'FRAPS',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 8,
        name_subcategory: CATEGORIES.C2_S1,
        order_subcategory: 1,
        boolean_response: true  
      },
      { 
        question: 'Manual de vehículo',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 9,
        name_subcategory: CATEGORIES.C2_S1,
        order_subcategory: 1,
        boolean_response: true  
      },
      { 
        question: 'Lámpara de mano',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 10,
        name_subcategory: CATEGORIES.C2_S2,
        order_subcategory: 2,
        boolean_response: true  
      },
      { 
        question: 'Guiaroji y/o GPS',
        name_category: CATEGORIES.C2,
        order_category: 2,
        order_question_category: 11,
        name_subcategory: CATEGORIES.C2_S2,
        order_subcategory: 2,
        boolean_response: true  
      },
    ], { transaction: tx })

    //* Comportamiento del motor (3)
    await Question.bulkCreate([
      { 
        question: 'Señal de fugas',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true,
      },
      { 
        question: 'Cables sueltos',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true,
      },
      { 
        question: 'Acumulador',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 3,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
      { 
        question: 'Aceite de motor',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 4,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
      { 
        question: 'Aceite de transmisión',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 5,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
      { 
        question: 'Aceite de dirección',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 6,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
      { 
        question: 'Líquido de frenos',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 7,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
      { 
        question: 'Anticongelante',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 8,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
      { 
        question: 'Liquido de limpiabrisas',
        name_category: CATEGORIES.C3,
        order_category: 3,
        order_question_category: 9,
        name_subcategory: CATEGORIES.C3_S1,
        order_subcategory: 1,
        enum_response: true  
      },
    ], { transaction: tx })

    //* Recorrido exterior lado del aperador (4)
    await Question.bulkCreate([
      { 
        question: 'Luces laterales de emergencia',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Base del espejo lateral',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Ventana del operador',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 3,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Goma de la pluma del limpiaparabrisas',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 4,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luz de navegación',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 5,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Llanta (inflado y apariencia)',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 6,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Defensa lateral',
        name_category: CATEGORIES.C4,
        order_category: 4,
        order_question_category: 7,
        boolean_response: true,
        enum_response: true  
      },
    ], { transaction: tx })

    //* Recorrido exterior frente (5)
    await Question.bulkCreate([
      { 
        question: 'Torreta',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luces frontales de emergencia',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Parabrisas',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 3,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Busca ruidos o anomalias',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 4,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luces generales, alta y baja',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 5,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Intermitentes',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 6,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Direccionales',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 7,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Parrilla de la unidad',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 8,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luces frontales de navegación',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 9,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Defensa delantera',
        name_category: CATEGORIES.C5,
        order_category: 5,
        order_question_category: 10,
        boolean_response: true,
        enum_response: true  
      },
    ], { transaction: tx })

    //* Recorrido exterior lado del copiloto (6)
    await Question.bulkCreate([
      { 
        question: 'Luces laterales de emergencia',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Base del espejo lateral',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Ventana del operador',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 3,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Goma de la pluma del limpiaparabrisas',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 4,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luz de navegación',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 5,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'LLanta (inflado y apariencia)',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 6,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Defensa lateral',
        name_category: CATEGORIES.C6,
        order_category: 6,
        order_question_category: 7,
        boolean_response: true,
        enum_response: true  
      },
    ], { transaction: tx })

    //* Compartimiento del paciente (7)
    await Question.bulkCreate([
      { 
        question: 'Luces de paso',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luz módulo de atención',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Aspirador Amb.',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 3,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Gavetas',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 4,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Camilla marina',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 5,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Camilla rigida',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 6,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Carro camilla',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 7,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Spiders',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 8,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Sujetadores',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 9,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Oxígeno central',
        name_category: CATEGORIES.C7,
        order_category: 7,
        order_question_category: 10,
        boolean_response: true,
        free_response: true  
      },
    ], { transaction: tx })

    //* Recorrido exterior posterior (8)
    await Question.bulkCreate([
      { 
        question: 'Barra de tráfico',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luces de emergencia',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luces de reversa',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 3,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Luces de alto',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 4,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Direccional',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 5,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Intermitentes',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 6,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Ventanas',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 7,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Defensa trasera',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 8,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Llanta de refacción',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 9,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'LLanta izquierda (inflado y apariencia)',
        name_category: CATEGORIES.C8,
        order_category: 8,
        order_question_category: 10,
        boolean_response: true,
        enum_response: true  
      },
    ], { transaction: tx })

    //* Herramienta y aditamentos (9)
    await Question.bulkCreate([
      { 
        question: 'Gato hidráulico',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 1,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Llave de cruz',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 2,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Extintor',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 3,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Triangulos reflejantes',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 4,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Conos (5)',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 5,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Cables pasa corriente',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 6,
        boolean_response: true,
        enum_response: true  
      },
      { 
        question: 'Kit de herramientas',
        name_category: CATEGORIES.C9,
        order_category: 9,
        order_question_category: 7,
        boolean_response: true,
        enum_response: true  
      },
    ], { transaction: tx })

    await tx.commit()

    return { success: true }

  } catch (error) {
    await tx?.rollback()
    console.log(error)
    throw { success: false }
  }
}