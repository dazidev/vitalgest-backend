import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Vitalgest',
      version: '1.0.0',
      description: 'Documentación mínima de endpoints (request y response).',
    },
    servers: [{ url: 'http://localhost:3000' }],
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
            rol: { type: 'string', example: 'admin' },
            state: { type: 'number', example: '1 or 0' },
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
  // Archivos donde tendrás comentarios @openapi
  apis: ['./src/**/*.ts'],
});