import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Vitalgest',
      version: '1.0.0',
      description: 'Documentación mínima de endpoints (request y response).',
    },
    servers: [{ url: 'https://vitalgest-backend.vercel.app' }],
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
            state: { type: 'string', example: 'true or false' },
            position: { type: 'string', example: 'cargo' },
          },
          required: ['name', 'lastname', 'email', 'rol'],
        },
        ResponseCreateUser:{
          type: 'object',
          properties: {
            success: { type: 'boolean' , example: true },
            data: { $ref: '#/components/schemas/User' }
          }
        },
      },
    },
  },
  apis: ['build/**/*.js'],
});