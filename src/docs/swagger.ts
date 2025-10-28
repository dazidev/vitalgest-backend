import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Vitalgest',
      version: '1.0.0',
      description: 'Documentación mínima de endpoints (request y response).',
    },
    servers: [
      { url: 'http://localhost:3000' },
      { url: 'https://vitalgest-backend.vercel.app' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        // Genéricos
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'CODE_LIST' },
          },
          required: ['success', 'error'],
        },
        // Tu dominio
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            lastname: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', example: 'admin' },
            state: { type: 'boolen', example: 'true' },
            position: { type: 'string', example: 'cargo' },
            DelegationId: { type: 'number', example: 1 }
          },
          required: ['name', 'lastname', 'email', 'role'],
        },
        ResponseCreateUser:{
          type: 'object',
          properties: {
            success: { type: 'boolean' , example: true },
            data: { $ref: '#/components/schemas/User' }
          }
        },
        Delegation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            state: {
              stateId: { type: 'string' },
              stateName: { type: 'string' },
            },
            municipality: {
              municipalityId: { type: 'string' },
              municipalityName: { type: 'string' },
            },
            pharmacyId: { type: 'string', format: 'uuid' },
          },
        },
        ResponseCreateDelegation:{
          type: 'object',
          properties: {
            success: { type: 'boolean' , example: true },
            data: { $ref: '#/components/schemas/Delegation' }
          }
        },
      },
    },
  },
  apis: [
    path.resolve('build/docs/adm.docs.js'),
    path.resolve('build/docs/delegations.docs.js'),
    path.resolve('build/docs/guards.docs.js'),
    path.resolve('build/docs/ambulances.docs.js'),
    path.resolve('build/docs/shifts.docs.js'),
    path.resolve('build/docs/checklists.docs.js'),
  ],
});