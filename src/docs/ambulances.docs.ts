/**
 * @openapi
 * /api/ambulances/create:
 *   post:
 *     summary: Crear ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 number: "263tsd21"
 *                 brand: "Toyota"
 *                 model: "Prius"
 *                 delegationId: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *     responses:
 *       201:
 *         description: Ambulancia creada
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "2a4ee64b-5108-4b1e-a779-aff4d291a766"
 *                     number: "263tsd21"
 *                     brand: "Toyota"
 *                     model: "Prius"
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
 * /api/ambulances/edit/{id}:
 *   put:
 *     summary: Editar ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 number: "263tsd21"
 *                 brand: "Toyota"
 *                 model: "Prius"
 *                 delegationId: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *     responses:
 *       200:
 *         description: Ambulancia actualizada
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
 * /api/ambulances/delete/{id}:
 *   delete:
 *     summary: Eliminar ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Ambulancia eliminada
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
 * /api/ambulances/many:
 *   get:
 *     summary: Obtener ambulancias
 *     description: >
 *       Obtiene la lista de ambulancias registradas. Permite aplicar
 *       paginación mediante limit y offset.
 *       Si no se envían parámetros de paginación, devuelve todas las
 *       ambulancias. La propiedad total indica la cantidad de
 *       ambulancias registradas, independientemente de limit y offset.
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de ambulancias a devolver.
 *         example: 10
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de ambulancias que se deben omitir antes de devolver resultados.
 *         example: 0
 *
 *     responses:
 *       200:
 *         description: Ambulancias obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *                 - total
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: Lista de ambulancias obtenidas.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       number:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       model:
 *                         type: string
 *                       delegation:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                 total:
 *                   type: integer
 *                   minimum: 0
 *                   description: >
 *                     Cantidad total de ambulancias registradas
 *                     sin aplicar limit ni offset.
 *                   example: 24
 *
 *             examples:
 *               withoutPagination:
 *                 summary: Respuesta sin paginación
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       number: "AMB-001"
 *                       brand: "Toyota"
 *                       model: "Hiace"
 *                       delegation:
 *                         id: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *                         name: "Delegación Ameca, Jalisco"
 *                     - id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                       number: "AMB-002"
 *                       brand: "Ford"
 *                       model: "Transit"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                         name: "Delegación Guadalajara, Jalisco"
 *                   total: 2
 *
 *               withPagination:
 *                 summary: Respuesta con limit y offset
 *                 description: >
 *                   Ejemplo de una consulta con limit=1 y offset=1.
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                       number: "AMB-002"
 *                       brand: "Ford"
 *                       model: "Transit"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                         name: "Delegación Guadalajara, Jalisco"
 *                   total: 2
 *
 *               emptyPage:
 *                 summary: Página sin resultados
 *                 description: >
 *                   La página solicitada no contiene registros,
 *                   aunque existen ambulancias registradas.
 *                 value:
 *                   success: true
 *                   data: []
 *                   total: 24
 *
 *               noAmbulances:
 *                 summary: Sin ambulancias registradas
 *                 value:
 *                   success: true
 *                   data: []
 *                   total: 0
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
 * /api/ambulances/one/{id}:
 *   get:
 *     summary: Obtener ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Ambulancia obtenida
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                     number: "1234dfde23"
 *                     brand: "toyota"
 *                     model: "corolla"
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

/**
 * @openapi
 * /api/ambulances/areas:
 *   get:
 *     summary: Obtener areas de ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Areas obtenidas
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       name: "EQUIPO DE COMUNICACIÓN Y SEÑALIZACIÓN"
 *                       section: "GENERAL"
 *                       order: 1
 *                       createdAt: "2025-11-07T19:43:16.000Z"
 *                       updatedAt: "2025-11-07T19:43:16.000Z"
 *                     - id: 2
 *                       name: "ÁREA DE TRANSPORTE Y SEGURIDAD"
 *                       section: "GENERAL"
 *                       order: 2
 *                       createdAt: "2025-11-07T19:43:16.000Z"
 *                       updatedAt: "2025-11-07T19:43:16.000Z"
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
