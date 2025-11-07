
/**
 * @openapi
 * /api/ambulances/supplies/create/{ambulanceId}:
 *   post:
 *     summary: Crear suministro en ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias (SUMINISTROS)']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ambulanceId
 *         required: true
 *         description: ID de la ambulancia en la que se asignará el suministro
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 avilableQuantity: 1
 *                 minQuantity: 1
 *                 areaId: 1
 *                 supplyId: "1a0dd44-457b-4003-a986-6077f0cc0dff"
 *     responses:
 *       201:
 *         description: Suministro creado en la ambulancia
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "1b3adde3-6b30-4e20-9ecd-dcab985201a3"
 *                     category: "Bolsa de válvula"
 *                     specification: "niño"
 *                     avialble_quantity: 1
 *                     min_quantity: 1
 *                     expiration_date: "2027-10-11T00:00:00.000Z"
 *                     measurement_unit: "lbs"
 *                     area_id: 1
 *                     ambulance_id: "b5f5c2be-759e-49a0-bf47-b55202669270"
 *                     updatedAt: "2025-11-07T04:50:02.832Z"
 *                     createdAt: "2025-11-07T04:50:02.832Z"
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
 * /api/ambulances/supplies/edit/{ambulanceSupplyId}:
 *   put:
 *     summary: Editar suministro en ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias (SUMINISTROS)']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ambulanceSupplyId
 *         required: true
 *         description: ID del registro de suministro en ambulancia que se desea editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 avabileQuantity: 1
 *                 minQuantity: 1
 *                 areaId: 1
 *                 ambulanceId: "b5f5c2be-759e-49a0-bf47-b55202669270"
 *     responses:
 *       200:
 *         description: Suministro en ambulancia actualizado correctamente
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
 * /api/ambulances/supplies/delete/{ambulanceSupplyId}:
 *   delete:
 *     summary: Eliminar suministro de ambulancia por ID
 *     tags: ['ENDPOINTS Gestión de ambulancias (SUMINISTROS)']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ambulanceSupplyId
 *         required: true
 *         description: ID del registro de suministro en ambulancia que se desea eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suministro de ambulancia eliminado correctamente
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
 * /api/ambulances/supplies/{ambulanceId}:
 *   get:
 *     summary: Obtener suministros de una ambulancia
 *     tags: ['ENDPOINTS Gestión de ambulancias (SUMINISTROS)']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ambulanceId
 *         required: true
 *         description: ID de la ambulancia de la que se desean obtener los suministros
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de suministros de la ambulancia
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "1b3adde3-6b30-4e20-9ecd-dcab985201a3"
 *                       category: "Bolsa de válvula"
 *                       specification: "niño"
 *                       avialble_quantity: 1
 *                       min_quantity: 1
 *                       expiration_date: "2027-10-11T00:00:00.000Z"
 *                       measurement_unit: "lbs"
 *                       area_id: 1
 *                       ambulance_id: "b5f5c2be-759e-49a0-bf47-b55202669270"
 *                       createdAt: "2025-11-07T04:50:03.000Z"
 *                       updatedAt: "2025-11-07T04:53:44.000Z"
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
 * /api/ambulances/supplies/one/{ambulanceSupplyId}:
 *   get:
 *     summary: Obtener un suministro de ambulancia por ID
 *     tags: ['ENDPOINTS Gestión de ambulancias (SUMINISTROS)']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ambulanceSupplyId
 *         required: true
 *         description: ID del registro de suministro en ambulancia que se desea consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suministro de ambulancia obtenido correctamente
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "1b3adde3-6b30-4e20-9ecd-dcab985201a3"
 *                     category: "Bolsa de válvula"
 *                     specification: "niño"
 *                     avialble_quantity: 1
 *                     min_quantity: 1
 *                     expiration_date: "2027-10-11T00:00:00.000Z"
 *                     measurement_unit: "lbs"
 *                     area_id: 1
 *                     ambulance_id: "b5f5c2be-759e-49a0-bf47-b55202669270"
 *                     createdAt: "2025-11-07T04:50:03.000Z"
 *                     updatedAt: "2025-11-07T04:53:44.000Z"
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




