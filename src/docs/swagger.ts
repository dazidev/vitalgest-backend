import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Vitalgest",
      version: "1.0.0",
      description: "Documentación de endpoints (request y response).",
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: "https://vitalgest-backend.vercel.app" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string", example: "CODE_LIST" },
          },
          required: ["success", "error"],
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            lastname: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", example: "admin" },
            state: { type: "boolean", example: true },
            position: { type: "string", example: "cargo" },
            DelegationId: { type: "number", example: 1 },
          },
          required: ["name", "lastname", "email", "role"],
        },
        ResponseCreateUser: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/User" },
          },
        },
        Delegation: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            state: {
              stateId: { type: "string" },
              stateName: { type: "string" },
            },
            municipality: {
              municipalityId: { type: "string" },
              municipalityName: { type: "string" },
            },
            pharmacyId: { type: "string", format: "uuid" },
          },
        },
        ResponseCreateDelegation: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Delegation" },
          },
        },
        QuestionCategory: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Compartimiento del operador" },
            order: { type: "integer", minimum: 1, example: 2 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        QuestionSubcategory: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            category_id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Documentación" },
            order: { type: "integer", minimum: 1, example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Question: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            question: { type: "string", example: "Licencia de conducir" },
            category_id: { type: "string", format: "uuid" },
            subcategory_id: { type: "string", format: "uuid", nullable: true },
            order_question_category: {
              type: "integer",
              minimum: 1,
              example: 1,
            },
            type_response: {
              type: "string",
              enum: [
                "bool",
                "option",
                "text",
                "bool_option",
                "bool_text",
                "option_text",
                "bool_option_text",
              ],
              example: "bool",
            },
            category: { $ref: "#/components/schemas/QuestionCategory" },
            subcategory: {
              allOf: [{ $ref: "#/components/schemas/QuestionSubcategory" }],
              nullable: true,
            },
            // Campos derivados para compatibilidad con los clientes de checklists.
            name_category: {
              type: "string",
              example: "Compartimiento del operador",
            },
            order_category: { type: "integer", example: 2 },
            name_subcategory: {
              type: "string",
              nullable: true,
              example: "Documentación",
            },
            order_subcategory: { type: "integer", nullable: true, example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        AnswerComponent: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            type: {
              type: "string",
              enum: [
                "bool",
                "option",
                "text",
                "bool_option",
                "bool_text",
                "option_text",
                "bool_option_text",
              ],
            },
            value_bool: { type: "boolean", nullable: true },
            value_option: { type: "string", nullable: true },
            value_text: { type: "string", nullable: true },
          },
        },
        AmbulanceAnswer: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            question: { $ref: "#/components/schemas/Question" },
            components: {
              allOf: [{ $ref: "#/components/schemas/AnswerComponent" }],
              nullable: true,
            },
          },
        },
        ChecklistAmbulanceDetail: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            time: { type: "string", example: "02:51:48" },
            km: { type: "integer", example: 46 },
            gas_path: { type: "string", example: "sin utilizar" },
            sign_deliverer_path: { type: "string", nullable: true },
            sign_recipient_path: { type: "string", nullable: true },
            notes: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            ambulance: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                number: { type: "string" },
              },
            },
            shift: {
              type: "object",
              description:
                "Turno, guardia, jefe de guardia, paramédico y conductor",
            },
            deliverer: { type: "object", nullable: true },
            recipient: { type: "object", nullable: true },
            answers: {
              type: "array",
              items: { $ref: "#/components/schemas/AmbulanceAnswer" },
            },
          },
        },
      },
    },
  },
  apis: [
    path.resolve("build/docs/adm.docs.js"),
    path.resolve("build/docs/delegations.docs.js"),
    path.resolve("build/docs/guards.docs.js"),
    path.resolve("build/docs/ambulances.docs.js"),
    path.resolve("build/docs/supplies-ambulance.docs.js"),
    path.resolve("build/docs/shifts.docs.js"),
    path.resolve("build/docs/checklists.docs.js"),
    path.resolve("build/docs/questions.docs.js"),
    path.resolve("build/docs/supplies.docs.js"),
    path.resolve("build/docs/users.docs.js"),
  ],
});
