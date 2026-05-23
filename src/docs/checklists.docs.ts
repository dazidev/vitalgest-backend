/**
 * @openapi
 * /api/checklists/ambulance/questions:
 *   post:
 *     summary: Obtener preguntas del checklist de ambulancia
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filtra las preguntas por categoria
 *         required: false
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Respuestas obtenidas
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                       question: "Limpieza de la unidad"
 *                       name_category: "Apariencia general"
 *                       order_category: 1
 *                       order_question_category: 1
 *                       name_subcategory: null
 *                       order_subcategory: null
 *                       type_response: ['bool', 'option', 'text', 'bool_option', 'bool_text', 'option_text', 'bool_option_text']
 *                       createdAt: "2025-10-27T23:49:38.000Z"
 *                       updatedAt: "2025-10-27T23:49:38.000Z"
 *                     - id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                       question: "Limpieza de la unidad"
 *                       name_category: "Apariencia general"
 *                       order_category: 1
 *                       order_question_category: 1
 *                       name_subcategory: null
 *                       order_subcategory: null
 *                       type_response: ['bool', 'option', 'text', 'bool_option', 'bool_text', 'option_text', 'bool_option_text']
 *                       createdAt: "2025-10-27T23:49:38.000Z"
 *                       updatedAt: "2025-10-27T23:49:38.000Z"
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
 * /api/checklists/ambulance/create:
 *   post:
 *     summary: Crear checklist de ambulancia
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - ambulanceId
 *               - shiftId
 *               - km
 *               - gasFile
 *             properties:
 *               ambulanceId:
 *                 type: string
 *                 format: uuid
 *               shiftId:
 *                 type: string
 *                 format: uuid
 *               km:
 *                 type: number
 *                 minimum: 0
 *               gasFile:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             gasFile:
 *               contentType: image/jpeg, image/png, application/pdf
 *             signOperatorFile:
 *               contentType: image/jpeg, image/png, application/pdf
 *             signRecipientFile:
 *               contentType: image/jpeg, image/png, application/pdf
 *     responses:
 *       201:
 *         description: Cheklist creado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                     ambulance_id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                     shift_id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                     time: 12:25:26
 *                     km: 12345
 *                     gas_path: uploads/ambulance/.....
 *                     createdAt: "2025-10-27T23:49:38.000Z"
 *                     updatedAt: "2025-10-27T23:49:38.000Z"
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
 * /api/checklists/ambulance/delete/{id}:
 *   delete:
 *     summary: Eliminar checklist
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Checklist eliminado
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
 * /api/checklists/ambulance/{id}/sign:
 *   put:
 *     summary: Firmar checklist de ambulancia
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del checklist de ambulancia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - delivererId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que recibe el checklist
 *               delivererId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que entrega el checklist
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Observaciones o notas del checklist
 *           examples:
 *             request:
 *               value:
 *                 recipientId: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                 delivererId: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                 notes: "Checklist recibido correctamente"
 *     responses:
 *       200:
 *         description: Checklist de ambulancia firmado correctamente
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
 *       404:
 *         description: Checklist de ambulancia no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @openapi
 * /api/checklists/ambulance/answers/{id}:
 *   put:
 *     summary: Guardar respuestas del checklist de ambulancia
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del checklist de ambulancia (checklistAmbulanceId)
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 description: Arreglo de respuestas por pregunta.
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - type
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       format: uuid
 *                       description: ID de la pregunta a responder.
 *                     type:
 *                       type: string
 *                       enum: [bool, option, text]
 *                       description: Tipo de respuesta.
 *                     valueBool:
 *                       type: boolean
 *                       nullable: true
 *                       description: Valor cuando `type = "bool"`.
 *                     valueOption:
 *                       type: string
 *                       nullable: true
 *                       description: Opción seleccionada cuando `type = "option"`.
 *                     valueText:
 *                       type: string
 *                       nullable: true
 *                       description: Texto libre cuando `type = "text"`.
 *           examples:
 *             ejemplo:
 *               value:
 *                 answers:
 *                   - questionId: "9b2f4e6c-9baf-4a64-9f22-6c2d1f1a1a11"
 *                     type: "bool"
 *                     valueBool: true
 *                   - questionId: "1b3c5d7e-8f90-4a12-b345-6789abcdef01"
 *                     type: "option"
 *                     valueOption: "OK"
 *                   - questionId: "22222222-3333-4444-5555-666666666666"
 *                     type: "text"
 *                     valueText: "Observación del operador"
 *     responses:
 *       200:
 *         description: Respuestas guardadas
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
 * /api/checklists/ambulance/{id}:
 *   get:
 *     summary: Obtener checklist de ambulancia con respuestas
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del checklist de ambulancia
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "36c23dc9-54a6-46a6-985b-e12135a8cb07"
 *     responses:
 *       200:
 *         description: Checklist encontrado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "36c23dc9-54a6-46a6-985b-e12135a8cb07"
 *                     time: "02:51:48"
 *                     km: 46
 *                     gas_path: "sin utilizar"
 *                     sign_operator_path: null
 *                     sign_recipient_path: null
 *                     notes: "El notario"
 *                     createdAt: "2026-05-20T02:51:48.000Z"
 *                     updatedAt: "2026-05-20T02:53:06.000Z"
 *                     ambulance:
 *                       id: "23258793-4071-4b9b-b90a-10afa641b27f"
 *                       number: "DF434F7"
 *                     shift:
 *                       id: "89b576c4-e58a-499c-8bc3-5530e4464cdf"
 *                       guard:
 *                         id: "160fc040-1612-438a-975f-ffcfa60614e3"
 *                         date: "2026-05-20T00:00:00.000Z"
 *                         state: "Cerrada"
 *                         guardChief:
 *                           id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                           name: "Jefe Guardia"
 *                           lastname: "Seed"
 *                       paramedical:
 *                         id: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                         name: "Paramedico"
 *                         lastname: "Seed"
 *                       driver:
 *                         id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                         name: "Chofer"
 *                         lastname: "Seed"
 *                     recipient:
 *                       id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                       name: "Jefe Guardia"
 *                       lastname: "Seed"
 *                     deliverer:
 *                       id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                       name: "Jefe Guardia"
 *                       lastname: "Seed"
 *                     answers:
 *                       - id: "8ed1c998-1e9e-4fb7-8c90-a9049bb9da71"
 *                         question:
 *                           id: "0e03b153-2a87-4357-9a30-95d31b6d2299"
 *                           question: "Limpieza de la unidad"
 *                           name_category: "Apariencia general"
 *                           order_category: 1
 *                           order_question_category: 1
 *                           name_subcategory: null
 *                           order_subcategory: null
 *                           type_response: "bool"
 *                         components:
 *                           id: "b1beed37-4639-4797-9b61-acc0807d85ca"
 *                           type: "bool"
 *                           value_bool: true
 *                           value_option: null
 *                           value_text: null
 *                       - id: "da3c238a-b7fb-4e49-9732-7f375ffe7c5b"
 *                         question:
 *                           id: "cf03f9e3-1699-4a3c-b1bf-4b5e56346c7b"
 *                           question: "Señal de fugas"
 *                           name_category: "Compartimiento del motor"
 *                           order_category: 3
 *                           order_question_category: 1
 *                           name_subcategory: null
 *                           order_subcategory: null
 *                           type_response: "bool_option"
 *                         components:
 *                           id: "c20b2d4b-a544-4c2f-8060-b416f40efc5e"
 *                           type: "bool_option"
 *                           value_bool: true
 *                           value_option: "bueno"
 *                           value_text: null
 *                       - id: "8f1707ae-caa6-4bd2-aca5-2b6289b5609e"
 *                         question:
 *                           id: "44363d03-7cbe-4c22-9558-9642d66af6fa"
 *                           question: "Aceite de motor"
 *                           name_category: "Compartimiento del motor"
 *                           order_category: 3
 *                           order_question_category: 4
 *                           name_subcategory: "Parámetros de niveles"
 *                           order_subcategory: 1
 *                           type_response: "option"
 *                         components:
 *                           id: "782b1778-b81e-4610-b0c6-b86cd07468d5"
 *                           type: "option"
 *                           value_bool: null
 *                           value_option: "bueno"
 *                           value_text: null
 *                       - id: "da9514c3-ac47-4d78-9126-deffa666d8b0"
 *                         question:
 *                           id: "65f5a1d1-cce1-48e6-ad83-cd6299726d7d"
 *                           question: "Oxígeno central"
 *                           name_category: "Compartimiento del paciente"
 *                           order_category: 7
 *                           order_question_category: 10
 *                           name_subcategory: null
 *                           order_subcategory: null
 *                           type_response: "bool_text"
 *                         components:
 *                           id: "a50e190e-9453-4ff8-8288-ba8dce06e1b2"
 *                           type: "bool_text"
 *                           value_bool: true
 *                           value_option: null
 *                           value_text: "100"
 *       400:
 *         description: ID inválido u otros datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Checklist no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/supply/create:
 *   post:
 *     summary: Crear checklist de suministros
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shiftId
 *             properties:
 *               shiftId:
 *                 type: string
 *                 format: uuid
 *           examples:
 *             request:
 *               value:
 *                 shiftId: "b3a12058-7e5b-4edc-a01c-f0bdd1f38720"
 *     responses:
 *       201:
 *         description: Checklist creado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "d204151f-804b-4031-ad2d-d1db962abf63"
 *                     sign_paramedical_path: null
 *                     sign_recipient_path: null
 *                     shift_id: "b3a12058-7e5b-4edc-a01c-f0bdd1f38720"
 *                     updatedAt: "2025-11-24T01:31:52.287Z"
 *                     createdAt: "2025-11-24T01:31:52.287Z"
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
 * /api/checklists/supply/delete/{id}:
 *   delete:
 *     summary: Eliminar checklist de suministros
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del checklist de suministros
 *     responses:
 *       200:
 *         description: Checklist eliminado correctamente
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
 *       404:
 *         description: Checklist no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @openapi
 * /api/checklists/supply/{id}/sign:
 *   put:
 *     summary: Firmar checklist de suministros
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del checklist de suministros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - delivererId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que recibe el checklist de suministros
 *               delivererId:
 *                 type: string
 *                 format: uuid
 *                 description: ID del usuario que entrega el checklist de suministros
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 description: Observaciones o notas del checklist
 *           examples:
 *             request:
 *               value:
 *                 recipientId: "ad39232c-f896-4f9b-a11e-ffe4668ba430"
 *                 delivererId: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                 notes: "Aca una nota en texto"
 *     responses:
 *       200:
 *         description: Checklist de suministros firmado correctamente
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
 *       404:
 *         description: Checklist de suministros no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @openapi
 * /api/checklists/supply/answers/{id}:
 *   put:
 *     summary: Guardar respuestas del checklist de suministros
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del checklist de suministros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - supplyId
 *                     - requiredQuantity
 *                   properties:
 *                     supplyId:
 *                       type: string
 *                       format: uuid
 *                     requiredQuantity:
 *                       type: integer
 *                       minimum: 0
 *           examples:
 *             request:
 *               value:
 *                 answers:
 *                   - supplyId: "1d5438d6-7dbd-4766-bdf8-350be2adcb55"
 *                     requiredQuantity: 1
 *                   - supplyId: "c2c33dce-62c7-4be5-b277-d9cfae284d36"
 *                     requiredQuantity: 1
 *                   - supplyId: "e0d91e0c-15eb-470f-8664-afa7298568db"
 *                     requiredQuantity: 0
 *     responses:
 *       200:
 *         description: Respuestas guardadas correctamente
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
 *       404:
 *         description: Checklist no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */

/**
 * @openapi
 * /api/checklists/supply/{id}:
 *   get:
 *     summary: Obtener checklist de suministros por ID
 *     tags: ['ENDPOINTS Gestión de Checklists']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del checklist de suministros
 *     responses:
 *       200:
 *         description: Checklist de suministros encontrado correctamente
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "6a367407-0e60-40d6-b904-6e01f04745d7"
 *                     sign_paramedical_path: null
 *                     sign_recipient_path: null
 *                     notes: ""
 *                     createdAt: "2026-05-20T02:53:44.000Z"
 *                     updatedAt: "2026-05-20T02:59:41.000Z"
 *                     shift:
 *                       id: "89b576c4-e58a-499c-8bc3-5530e4464cdf"
 *                       guard:
 *                         id: "160fc040-1612-438a-975f-ffcfa60614e3"
 *                         date: "2026-05-20T00:00:00.000Z"
 *                         state: "Cerrada"
 *                         guardChief:
 *                           id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                           name: "Jefe Guardia"
 *                           lastname: "Seed"
 *                       paramedical:
 *                         id: "e8d02383-66a0-4ab0-8155-5c228933e84c"
 *                         name: "Paramedico"
 *                         lastname: "Seed"
 *                       driver:
 *                         id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                         name: "Chofer"
 *                         lastname: "Seed"
 *                     ambulance:
 *                       id: "23258793-4071-4b9b-b90a-10afa641b27f"
 *                       number: "DF434F7"
 *                     recipient:
 *                       id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                       name: "Jefe Guardia"
 *                       lastname: "Seed"
 *                     deliverer:
 *                       id: "43a7bc86-5a19-4fc6-9add-887489221169"
 *                       name: "Jefe Guardia"
 *                       lastname: "Seed"
 *                     answers:
 *                       - id: "6cffd14f-566d-42e3-9505-3cc951589274"
 *                         category: "Estetoscopio"
 *                         specification: "Pediatrico"
 *                         avaible_quantity: -2
 *                         min_quantity: 3
 *                         required_quantity: 5
 *                         measurement_unit: "unit"
 *                         createdAt: "2026-05-20T02:59:41.000Z"
 *                         updatedAt: "2026-05-20T02:59:41.000Z"
 *                         area:
 *                           id: 1
 *                           name: "EQUIPO DE VÍAS AÉREAS"
 *                           section: "GABINETE 1"
 *                           order: 1
 *                       - id: "ad4ef371-880c-4d98-874d-82118fa39436"
 *                         category: "Esfigmomanometro"
 *                         specification: "Adulto"
 *                         avaible_quantity: -3
 *                         min_quantity: 2
 *                         required_quantity: 5
 *                         measurement_unit: "unit"
 *                         createdAt: "2026-05-20T02:59:41.000Z"
 *                         updatedAt: "2026-05-20T02:59:41.000Z"
 *                         area:
 *                           id: 2
 *                           name: "EQUIPO DE CIRCULACIÓN Y CONTROL DE HEMORRAGIAS"
 *                           section: "GABINETE 2"
 *                           order: 2
 *                       - id: "5ca11fa3-19e8-4579-92da-aba9efa64b28"
 *                         category: "Bolsa de válvula - mascarilla (BVM)"
 *                         specification: "Adulto"
 *                         avaible_quantity: -2
 *                         min_quantity: 2
 *                         required_quantity: 4
 *                         measurement_unit: "unit"
 *                         createdAt: "2026-05-20T02:59:41.000Z"
 *                         updatedAt: "2026-05-20T02:59:41.000Z"
 *                         area:
 *                           id: 3
 *                           name: "MATERIAL PARTO DE EMERGANCIA"
 *                           section: "GABINETE 3"
 *                           order: 3
 *                       - id: "9683588f-13e6-41ed-894a-0d06f90d6e8d"
 *                         category: "Mascarilla con reservorio"
 *                         specification: "Adulto"
 *                         avaible_quantity: -2
 *                         min_quantity: 1
 *                         required_quantity: 3
 *                         measurement_unit: "unit"
 *                         createdAt: "2026-05-20T02:59:41.000Z"
 *                         updatedAt: "2026-05-20T02:59:41.000Z"
 *                         area:
 *                           id: 4
 *                           name: "OTROS ELEMENTOS"
 *                           section: "GABINETE 4"
 *                           order: 4
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
 *       404:
 *         description: Checklist de suministros no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
