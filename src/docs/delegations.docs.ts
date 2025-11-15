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

