
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
 * /api/guards/edit/{id}:
 *   put:
 *     summary: Editar guardia
 *     tags: ['ENDPOINTS Gestión de guardias']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 guardChief: "e732b0e9-d9cf-4c6a-974f-8ca92937a132"
 *                 date: "2025-10-02"
 *                 delegationId: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *     responses:
 *       200:
 *         description: Guardia actualizada
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
 * /api/guards/delete/{id}:
 *   delete:
 *     summary: Eliminar guardia
 *     tags: ['ENDPOINTS Gestión de guardias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Guardia eliminada
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
 * /api/guards/many/{amount} | all:
 *   get:
 *     summary: Obtener guardia/s
 *     tags: ['ENDPOINTS Gestión de guardias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Guardia/s obtenida/s
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data: 
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       date: "2025-10-02"
 *                       state: "En curso | Nueva | Cerrada"
 *                       guardChief: 
 *                         id: "6d3bd19a-a564-4054-be3f-4db99e116703"
 *                         name: "Yoangel"
 *                         lastname: "MIS"
 *                         email: "yoa13@outlook.com"
 *                       delegation:
 *                         id: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *                         name: "Delegación Ameca, Jalisco"
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       date: "2025-10-02"
 *                       state: "En curso | Nueva | Cerrada"
 *                       guardChief: 
 *                         id: "6d3bd19a-a564-4054-be3f-4db99e116703"
 *                         name: "Yoangel"
 *                         lastname: "MIS"
 *                         email: "yoa13@outlook.com"
 *                       delegation:
 *                         id: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *                         name: "Delegación Ameca, Jalisco"
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
 * /api/guards/one/{id}:
 *   get:
 *     summary: Obtener guardia
 *     tags: ['ENDPOINTS Gestión de guardias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Guardia obtenida
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data: 
 *                     id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                     date: "2025-10-02"
 *                     state: "En curso | Nueva | Cerrada"
 *                     guardChief: 
 *                       id: "6d3bd19a-a564-4054-be3f-4db99e116703"
 *                       name: "Yoangel"
 *                       lastname: "MIS"
 *                       email: "yoa13@outlook.com"
 *                     delegation:
 *                       id: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *                       name: "Delegación Ameca, Jalisco"
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