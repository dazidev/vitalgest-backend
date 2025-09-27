"use strict";
/**
 * @openapi
 * /api/delegations/states:
 *   get:
 *     summary: Obtener estados
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Estados encontrados
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: "Jalisco"
 *
 *       404:
 *         description: No se encontraron estados
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
/**
 * @openapi
 * /api/delegations/state/{stateId}/municipalities:
 *   get:
 *     summary: Obtener municipios según estado
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Municipios encontrados
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: "ameca"
 *                       state_id: 1
 *
 *       404:
 *         description: No se encontraron municipios
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */ 
