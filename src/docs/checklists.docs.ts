
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
 *               - signOperatorFile
 *               - signRecipientFile
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
 *               notes:
 *                type: string
 *               gasFile:
 *                 type: string
 *                 format: binary
 *               signOperatorFile:
 *                 type: string
 *                 format: binary
 *               signRecipientFile:
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - signOperatorFile
 *               - signRecipientFile
 *             properties:
 *               signOperatorFile:
 *                 type: string
 *                 format: binary
 *               signRecipientFile:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             signOperatorFile:
 *               contentType: image/jpeg, image/png, application/pdf
 *             signRecipientFile:
 *               contentType: image/jpeg, image/png, application/pdf
 *     responses:
 *       201:
 *         description: Cheklist firmado
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
 *                     id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                     ambulance_id: "2e0c0a4f-bc9f-4b59-9f21-5e6fbd123456"
 *                     shift_id: "e1f9f4a1-8b2c-4c4a-9e3b-0f5a9d789abc"
 *                     time: "12:25:26"
 *                     km: 12345
 *                     notes: "Observaciones generales del turno"
 *                     gas_path: "uploads/ambulance/2025-11/2e0c0a4f-bc9f-4b59-9f21-5e6fbd123456/gas-ticket.jpg"
 *                     sign_operator_path: "uploads/ambulance/2025-11/2e0c0a4f-bc9f-4b59-9f21-5e6fbd123456/sign-operator.png"
 *                     sign_recipient_path: "uploads/ambulance/2025-11/2e0c0a4f-bc9f-4b59-9f21-5e6fbd123456/sign-recipient.png"
 *                     createdAt: "2025-10-27T23:49:38.000Z"
 *                     updatedAt: "2025-10-27T23:49:38.000Z"
 *                     answers:
 *                       - id: "11111111-2222-3333-4444-555555555555"
 *                         checklist_ambulance_id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                         question:
 *                           id: "9b2f4e6c-9baf-4a64-9f22-6c2d1f1a1a11"
 *                           question: "¿La ambulancia se encuentra limpia por dentro?"
 *                           name_category: "Unidad"
 *                           order_category: 1
 *                           order_question_category: 1
 *                           name_subcategory: "Cabina"
 *                           order_subcategory: 1
 *                           type_response: "bool"
 *                         components:
 *                           - id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
 *                             type: "bool"
 *                             value_bool: true
 *                             value_option: null
 *                             value_text: null
 *                       - id: "66666666-7777-8888-9999-000000000000"
 *                         checklist_ambulance_id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                         question:
 *                           id: "1b3c5d7e-8f90-4a12-b345-6789abcdef01"
 *                           question: "Nivel de combustible"
 *                           name_category: "Unidad"
 *                           order_category: 1
 *                           order_question_category: 2
 *                           name_subcategory: "Motor"
 *                           order_subcategory: 2
 *                           type_response: "option"
 *                         components:
 *                           - id: "bbbbbbbb-cccc-dddd-eeee-ffffffffffff"
 *                             type: "option"
 *                             value_bool: null
 *                             value_option: "3/4"
 *                             value_text: null
 *                       - id: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                         checklist_ambulance_id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                         question:
 *                           id: "22222222-3333-4444-5555-666666666666"
 *                           question: "Observaciones adicionales"
 *                           name_category: "Unidad"
 *                           order_category: 1
 *                           order_question_category: 3
 *                           name_subcategory: "General"
 *                           order_subcategory: 3
 *                           type_response: "text"
 *                         components:
 *                           - id: "cccccccc-dddd-eeee-ffff-000000000000"
 *                             type: "text"
 *                             value_bool: null
 *                             value_option: null
 *                             value_text: "La unidad presenta un ligero desgaste en las llantas traseras."
 *       400:
 *         description: ID inválido u otros datos inválidos
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



