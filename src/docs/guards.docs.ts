/**
 * @openapi
 * /api/guards/create:
 *   post:
 *     summary: Crear guardia
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
 *                     guardChief:
 *                       id: "e732b0e9-d9cf-4c6a-974f-8ca92937a132"
 *                     date: "2025-10-03"
 *                     delegation:
 *                       id: "d0b0090f-0dd9-4337-8695-29de58535d25"
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
 *                 state: "Nueva"
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
 * /api/guards/many:
 *   get:
 *     summary: Obtener guardias
 *     description: >
 *       Obtiene la lista de guardias registradas. Permite aplicar paginación
 *       mediante limit y offset. Si no se envían query params, devuelve todas
 *       las guardias.
 *     tags: ['ENDPOINTS Gestión de guardias']
 *     security: [{ bearerAuth: [] }]
 *
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de guardias a devolver.
 *         example: 5
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de guardias que se deben omitir antes de empezar a devolver resultados.
 *         example: 0
 *
 *     responses:
 *       200:
 *         description: Guardias obtenidas correctamente
 *         content:
 *           application/json:
 *             examples:
 *               withoutPagination:
 *                 summary: Respuesta sin paginación
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       date: "2026-05-11"
 *                       state: "active"
 *                       created_at: "2026-05-11T08:10:07.000Z"
 *                       updated_at: "2026-05-11T09:03:59.000Z"
 *                       guardChief:
 *                         id: "3f5d3291-4160-436d-a11d-785204291e50"
 *                         name: "Admin"
 *                         lastname: "Seed"
 *                         email: "adminseed@vitalgest.mx"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                         name: "Delegación Guadalajara, Jalisco"
 *                       shifts:
 *                         - id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                           name: "Turno mañana"
 *                           created_at: "2026-05-11T08:10:07.000Z"
 *                           updated_at: "2026-05-11T09:03:59.000Z"
 *                           ambulance:
 *                             id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                             number: "AMB-001"
 *                           paramedical:
 *                             id: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                             name: "Paramedico"
 *                             lastname: "Seed"
 *                           driver:
 *                             id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                             name: "Chofer"
 *                             lastname: "Seed"
 *                           checklistAmbulance: {}
 *                           checklistSupplies: {}
 *
 *               withPagination:
 *                 summary: Respuesta con limit y offset
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       date: "2026-05-11"
 *                       state: "active"
 *                       created_at: "2026-05-11T08:10:07.000Z"
 *                       updated_at: "2026-05-11T09:03:59.000Z"
 *                       guardChief:
 *                         id: "3f5d3291-4160-436d-a11d-785204291e50"
 *                         name: "Admin"
 *                         lastname: "Seed"
 *                         email: "adminseed@vitalgest.mx"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                         name: "Delegación Guadalajara, Jalisco"
 *                       shifts: []
 *
 *       400:
 *         description: Datos inválidos. Puede ocurrir si limit u offset no son válidos.
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
