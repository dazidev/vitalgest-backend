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
 *     description: >
 *       Obtiene la lista de turnos asociados a una guardia específica.
 *       Permite aplicar paginación mediante limit y offset.
 *       Si no se envían parámetros de paginación, devuelve todos los
 *       turnos de la guardia. La propiedad total indica la cantidad
 *       de turnos asociados a la guardia, independientemente de
 *       limit y offset.
 *     tags: ['ENDPOINTS Gestión de turnos']
 *     security: [{ bearerAuth: [] }]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la guardia.
 *         example: "5597ebcb-1311-4370-8499-128883eb0fde"
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de turnos a devolver.
 *         example: 10
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de turnos que se deben omitir antes de devolver resultados.
 *         example: 0
 *
 *     responses:
 *       200:
 *         description: Turnos obtenidos correctamente.
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
 *                   description: Lista de turnos de la guardia.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       ambulance:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           number:
 *                             type: string
 *                       paramedical:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           lastname:
 *                             type: string
 *                       driver:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           lastname:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   minimum: 0
 *                   description: >
 *                     Cantidad total de turnos pertenecientes a la
 *                     guardia solicitada, sin aplicar limit ni offset.
 *                   example: 8
 *
 *             examples:
 *               withoutPagination:
 *                 summary: Respuesta sin paginación
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                       name: "Turno mañana"
 *                       ambulance:
 *                         id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                         number: "AMB-001"
 *                       paramedical:
 *                         id: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                         name: "Paramedico"
 *                         lastname: "Seed"
 *                       driver:
 *                         id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                         name: "Chofer"
 *                         lastname: "Seed"
 *                       createdAt: "2026-05-11T08:10:07.000Z"
 *                       updatedAt: "2026-05-11T09:03:59.000Z"
 *                     - id: "9d4cc86e-8902-41eb-abcd-12ef34567890"
 *                       name: "Turno tarde"
 *                       ambulance:
 *                         id: "6597ebcb-1311-4370-8499-128883eb0fde"
 *                         number: "AMB-002"
 *                       paramedical:
 *                         id: "f8d02383-66a0-4ab0-8155-5c228933e84c"
 *                         name: "Juan"
 *                         lastname: "Pérez"
 *                       driver:
 *                         id: "53a7bc86-5a19-4fc6-9add-887489221169"
 *                         name: "Pedro"
 *                         lastname: "Gómez"
 *                       createdAt: "2026-05-11T14:00:00.000Z"
 *                       updatedAt: "2026-05-11T14:00:00.000Z"
 *                   total: 2
 *
 *               withPagination:
 *                 summary: Respuesta con limit y offset
 *                 description: >
 *                   Ejemplo de una consulta con limit=1 y offset=0.
 *                   Se devuelve un turno, aunque la guardia tiene dos.
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "9d4cc86e-8902-41eb-abcd-12ef34567890"
 *                       name: "Turno tarde"
 *                       ambulance:
 *                         id: "6597ebcb-1311-4370-8499-128883eb0fde"
 *                         number: "AMB-002"
 *                       paramedical:
 *                         id: "f8d02383-66a0-4ab0-8155-5c228933e84c"
 *                         name: "Juan"
 *                         lastname: "Pérez"
 *                       driver:
 *                         id: "53a7bc86-5a19-4fc6-9add-887489221169"
 *                         name: "Pedro"
 *                         lastname: "Gómez"
 *                       createdAt: "2026-05-11T14:00:00.000Z"
 *                       updatedAt: "2026-05-11T14:00:00.000Z"
 *                   total: 2
 *
 *               emptyPage:
 *                 summary: Página sin resultados
 *                 description: >
 *                   La página solicitada no contiene registros,
 *                   aunque existen turnos asociados a la guardia.
 *                 value:
 *                   success: true
 *                   data: []
 *                   total: 2
 *
 *               noShifts:
 *                 summary: Guardia sin turnos registrados
 *                 value:
 *                   success: true
 *                   data: []
 *                   total: 0
 *
 *       400:
 *         description: Datos inválidos. Puede ocurrir si id, limit u offset no son válidos.
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
