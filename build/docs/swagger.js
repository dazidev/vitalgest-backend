"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
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
                ResponseCreateUser: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
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
                ResponseCreateDelegation: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { $ref: '#/components/schemas/Delegation' }
                    }
                },
            },
        },
    },
    apis: [
        path_1.default.resolve('build/docs/adm.docs.js'),
        path_1.default.resolve('build/docs/delegations.docs.js'),
        path_1.default.resolve('build/docs/guards.docs.js'),
        path_1.default.resolve('build/docs/ambulances.docs.js'),
    ],
});
