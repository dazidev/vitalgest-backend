"use strict";
/**
 * @openapi
 * /api/checklists/ambulance/questions:
 *   post:
 *     summary: Obtener preguntas del checklist de ambulancia
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filtra las preguntas por categoria
 *         required: false
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Turno creado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                       question: "Limpieza de la unidad"
 *                       name_category: "Apariencia general"
 *                       order_category: 1
 *                       order_question_category: 1
 *                       name_subcategory: null
 *                       order_subcategory: null
 *                       boolean_response: true
 *                       enum_response: false
 *                       free_response: false
 *                       createdAt: "2025-10-27T23:49:38.000Z"
 *                       updatedAt: "2025-10-27T23:49:38.000Z"
 *                     - id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                       question: "Limpieza de la unidad"
 *                       name_category: "Apariencia general"
 *                       order_category: 1
 *                       order_question_category: 1
 *                       name_subcategory: null
 *                       order_subcategory: null
 *                       boolean_response: true
 *                       enum_response: false
 *                       free_response: false
 *                       createdAt: "2025-10-27T23:49:38.000Z"
 *                       updatedAt: "2025-10-27T23:49:38.000Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
Object.defineProperty(exports, "__esModule", { value: true });
