
/**
 * @openapi
 * /api/shifts/create:
 *   post:
 *     summary: Crear turno
 *     tags: ['ENDPOINTS Gestión de turnos']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 ambulanceId: "5474054b-bf01-4db7-b416-4f1d21c8e84c"
 *                 guardId: "fbaa4820-3a9b-4321-a33c-b19feebf8769"
 *                 paramedicalId: "0f30a11e-4f5d-4d0a-a7b1-21083aaa1835"
 *                 driverId: "e70eeb99-09f1-4a86-9359-9902ab98b2b6"
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
 *                     id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                     name: "Turno DF434F7"
 *                     ambulance:
 *                       id: "5474054b-bf01-4db7-b416-4f1d21c8e84c"
 *                     guard:
 *                       id: "fbaa4820-3a9b-4321-a33c-b19feebf8769"
 *                     paramedical:
 *                       id: "0f30a11e-4f5d-4d0a-a7b1-21083aaa1835"
 *                     driver:
 *                       id: "e70eeb99-09f1-4a86-9359-9902ab98b2b6"
 *                     createdAt: "2025-10-27T14:31:00.467Z"
 *                     updatedAt: "2025-10-27T14:31:00.467Z"
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
 * /api/shifts/edit/{id}:
 *   put:
 *     summary: Editar turno
 *     tags: ['ENDPOINTS Gestión de turnos']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 ambulanceId: "5474054b-bf01-4db7-b416-4f1d21c8e84c"
 *                 guardId: "fbaa4820-3a9b-4321-a33c-b19feebf8769"
 *                 paramedicalId: "0f30a11e-4f5d-4d0a-a7b1-21083aaa1835"
 *                 driverId: "e70eeb99-09f1-4a86-9359-9902ab98b2b6"
 *     responses:
 *       200:
 *         description: Turno actualizado
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
 * /api/shifts/delete/{id}:
 *   delete:
 *     summary: Eliminar turno
 *     tags: ['ENDPOINTS Gestión de turnos']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: turno eliminado
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
 * /api/shifts/guard/{id}:
 *   get:
 *     summary: Obtener turnos de una guardia
 *     tags: ['ENDPOINTS Gestión de turnos']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Turnos obtenidos
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data: 
 *                     - id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                       name: "Turno DF434F6"
 *                       ambulance:
 *                         id: "5474054b-bf01-4db7-b416-4f1d21c8e84c"
 *                       guard:
 *                         id: "fbaa4820-3a9b-4321-a33c-b19feebf8769"
 *                       paramedical:
 *                         id: "0f30a11e-4f5d-4d0a-a7b1-21083aaa1835"
 *                       driver:
 *                         id: "e70eeb99-09f1-4a86-9359-9902ab98b2b6"
 *                       createdAt: "2025-10-27T14:31:00.467Z"
 *                       updatedAt: "2025-10-27T14:31:00.467Z"
 *                     - id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                       name: "Turno DF434F7"
 *                       ambulance:
 *                         id: "5474054b-bf01-4db7-b416-4f1d21c8e84c"
 *                       guard:
 *                         id: "fbaa4820-3a9b-4321-a33c-b19feebf8769"
 *                       paramedical:
 *                         id: "0f30a11e-4f5d-4d0a-a7b1-21083aaa1835"
 *                       driver:
 *                         id: "e70eeb99-09f1-4a86-9359-9902ab98b2b6"
 *                       createdAt: "2025-10-27T14:31:00.467Z"
 *                       updatedAt: "2025-10-27T14:31:00.467Z"
 *    
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
 * /api/shifts/one/{id}:
 *   get:
 *     summary: Obtener turno
 *     tags: ['ENDPOINTS Gestión de turnos']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Turno obtenido
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data: 
 *                     id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                     name: "Turno DF434F7"
 *                     ambulance:
 *                       id: "5474054b-bf01-4db7-b416-4f1d21c8e84c"
 *                     guard:
 *                       id: "fbaa4820-3a9b-4321-a33c-b19feebf8769"
 *                     paramedical:
 *                       id: "0f30a11e-4f5d-4d0a-a7b1-21083aaa1835"
 *                     driver:
 *                       id: "e70eeb99-09f1-4a86-9359-9902ab98b2b6"
 *                     createdAt: "2025-10-27T14:31:00.467Z"
 *                     updatedAt: "2025-10-27T14:31:00.467Z"
 * 
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