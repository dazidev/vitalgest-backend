
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
 * /api/ambulances/many/{amount} | all:
 *   get:
 *     summary: Obtener ambulancia/s
 *     tags: ['ENDPOINTS Gestión de ambulancias']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Ambulancia/s obtenida/s
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data: 
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       number: "1234dfde23"
 *                       brand: "toyota"
 *                       model: "corolla"
 *                       delegation:
 *                         id: "d50b8d02-02a9-41a2-88e2-74e7c4baf9f0"
 *                         name: "Delegación Ameca, Jalisco"
 *                     - id: "5597ebcb-1311-4370-8499-128883eb0fde"
 *                       number: "1234dfde23"
 *                       brand: "toyota"
 *                       model: "corolla"
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