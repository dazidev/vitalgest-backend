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
 *                       municipalities:
 *                         - id: 1
 *                           name: "Ameca"
 *                         - id: 2
 *                           name: "Tala"
 *                     - id: 2
 *                       name: "San Luis Potosí"
 *                       municipalities:
 *                         - id: null
 *                           name: null
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
 *                       name: "Ameca"
 *                       state:
 *                         id: 1
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
/**
 * @openapi
 * /api/delegations/create:
 *   post:
 *     summary: Crear delegación
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 stateId: 1
 *                 stateName: "Jalisco"
 *                 municipalityId: 1
 *                 municipalityName: "Ameca"
 *     responses:
 *       201:
 *         description: Delegación creada
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                     name: "Delegación Ameca, Jalisco"
 *                     state:
 *                       id: 1
 *                       name: "Jalisco"
 *                     municipality:
 *                       id: 1
 *                       name: "Ameca"
 *                     pharmacyId: "669ba7e8-1817-4536-b860-0a9440e970e2"
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
/**
 * @openapi
 * /api/delegations/edit/{id}:
 *   put:
 *     summary: Editar delegación
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 name: "Delegación Ameca, Jalisco"
 *                 stateId: 1
 *                 municipalityId: 1
 *     responses:
 *       200:
 *         description: Delegación actualizada
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
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
/**
 * @openapi
 * /api/delegations/delete/{id}:
 *   delete:
 *     summary: Eliminar delegación
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Delegación actualizada
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
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
/**
 * @openapi
 * /api/delegations/many/{amount} | all:
 *   get:
 *     summary: Obtener delegación/es
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Delegación obtenida
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                       name: "Delegación Ameca, Jalisco"
 *                       createdAt: "2025-11-07T19:43:15.000Z"
 *                       updatedAt: "2025-11-07T19:43:15.000Z"
 *                       municipality:
 *                         id: 1
 *                         name: "Ameca"
 *                       state:
 *                         id: 1
 *                         name: "Jalisco"
 *                       pharmacy:
 *                         id: "258a3b7d-782f-4615-a2f1-21c1f50e7255"
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
/**
 * @openapi
 * /api/delegations/one/{id}:
 *   get:
 *     summary: Obtener delegación
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Delegación obtenida
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                     name: "Delegación Ameca, Jalisco"
 *                     createdAt: "2025-11-07T19:43:15.000Z"
 *                     updatedAt: "2025-11-07T19:43:15.000Z"
 *                     municipality:
 *                       id: 1
 *                       name: "Ameca"
 *                     state:
 *                       id: 1
 *                       name: "Jalisco"
 *                     pharmacy:
 *                       id: "258a3b7d-782f-4615-a2f1-21c1f50e7255"
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
/**
 * @openapi
 * /api/delegations/members/{id}:
 *   get:
 *     summary: Obtener miembros de una delegación
 *     description: >
 *       Obtiene la lista de usuarios pertenecientes a una delegación específica.
 *       Permite filtrar por rol y aplicar paginación mediante limit y offset.
 *       Si no se envían query params, devuelve todos los miembros de la delegación.
 *     tags: ['ENDPOINTS Gestión de delegaciones']
 *     security: [{ bearerAuth: [] }]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la delegación.
 *         example: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - general_admin
 *             - admin
 *             - head_guard
 *             - vehicle_operator
 *             - paramedical
 *         description: Rol por el cual se desea filtrar a los miembros de la delegación.
 *         example: "paramedical"
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de miembros a devolver.
 *         example: 2
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de miembros que se deben omitir antes de empezar a devolver resultados.
 *         example: 0
 *
 *     responses:
 *       200:
 *         description: Miembros de la delegación obtenidos correctamente
 *         content:
 *           application/json:
 *             examples:
 *               withoutPagination:
 *                 summary: Respuesta sin paginación
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "3f5d3291-4160-436d-a11d-785204291e50"
 *                       name: "Admin"
 *                       lastname: "Seed"
 *                       email: "adminseed@vitalgest.mx"
 *                       status: true
 *                       role: "general_admin"
 *                       position: "developer"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-10T21:42:36.000Z"
 *                       updatedAt: "2026-05-10T21:45:06.000Z"
 *                     - id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                       name: "Jefe Guardia"
 *                       lastname: "Seed"
 *                       email: "jefeguardiaseed@vitalgest.mx"
 *                       status: true
 *                       role: "head_guard"
 *                       position: "Jefe de guardia"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-10T21:42:36.000Z"
 *                       updatedAt: "2026-05-10T21:42:36.000Z"
 *
 *               withPaginationAndRole:
 *                 summary: Respuesta con role, limit y offset
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                       name: "Paramedico"
 *                       lastname: "Seed"
 *                       email: "paramedicoseed@vitalgest.mx"
 *                       status: true
 *                       role: "paramedical"
 *                       position: "Paramedico"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-10T21:42:36.000Z"
 *                       updatedAt: "2026-05-10T21:42:36.000Z"
 *
 *       400:
 *         description: Datos inválidos. Puede ocurrir si el id, role, limit u offset no son válidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
