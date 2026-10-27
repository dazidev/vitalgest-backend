/**
 * @openapi
 * /api/checklists/ambulance/questions:
 *   get:
 *     summary: Obtener preguntas del checklist de ambulancia
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     description: Ordenadas por categoría, subcategoría y posición. Incluye los campos antiguos de
 *       nombres y órdenes calculados para compatibilidad.
 *     parameters:
 *     - in: query
 *       name: category
 *       required: false
 *       description: Orden de la categoría (entero positivo).
 *       schema:
 *         type: integer
 *         minimum: 1
 *         example: 2
 *     responses:
 *       '200':
 *         description: Preguntas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *             example:
 *               success: true
 *               data:
 *               - id: 0e03b153-2a87-4357-9a30-95d31b6d2299
 *                 question: Limpieza de la unidad
 *                 category_id: 33333333-3333-4333-8333-333333333333
 *                 subcategory_id: null
 *                 order_question_category: 1
 *                 type_response: bool
 *                 category:
 *                   id: 33333333-3333-4333-8333-333333333333
 *                   name: Apariencia general
 *                   order: 1
 *                 subcategory: null
 *                 name_category: Apariencia general
 *                 order_category: 1
 *                 name_subcategory: null
 *                 order_subcategory: null
 *               - id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 question: Licencia de conducir
 *                 category_id: 11111111-1111-4111-8111-111111111111
 *                 subcategory_id: 22222222-2222-4222-8222-222222222222
 *                 order_question_category: 1
 *                 type_response: bool
 *                 category:
 *                   id: 11111111-1111-4111-8111-111111111111
 *                   name: Compartimiento del operador
 *                   order: 2
 *                 subcategory:
 *                   id: 22222222-2222-4222-8222-222222222222
 *                   category_id: 11111111-1111-4111-8111-111111111111
 *                   name: Documentación
 *                   order: 1
 *                 name_category: Compartimiento del operador
 *                 order_category: 2
 *                 name_subcategory: Documentación
 *                 order_subcategory: 1
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/ambulance/create:
 *   post:
 *     summary: Crear checklist de ambulancia
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - ambulanceId
 *             - shiftId
 *             - km
 *             properties:
 *               ambulanceId:
 *                 type: string
 *                 format: uuid
 *               shiftId:
 *                 type: string
 *                 format: uuid
 *               km:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       '201':
 *         description: Checklist creado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 ambulance_id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 shift_id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 time: '12:25:26'
 *                 km: 12345
 *                 gas_path: sin utilizar
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/ambulance/delete/{id}:
 *   delete:
 *     summary: Eliminar checklist de ambulancia
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist
 *       schema:
 *         type: string
 *         format: uuid
 *     responses:
 *       '200':
 *         description: Checklist eliminado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/ambulance/{id}/sign:
 *   put:
 *     summary: Firmar checklist de ambulancia
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist
 *       schema:
 *         type: string
 *         format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - recipientId
 *             - delivererId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *               delivererId:
 *                 type: string
 *                 format: uuid
 *               notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '200':
 *         description: Checklist firmado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/ambulance/answers/{id}:
 *   put:
 *     summary: Guardar respuestas del checklist de ambulancia
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist
 *       schema:
 *         type: string
 *         format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                   - questionId
 *                   - type
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       format: uuid
 *                     type:
 *                       type: string
 *                       enum:
 *                       - bool
 *                       - option
 *                       - text
 *                       - bool_option
 *                       - bool_text
 *                       - option_text
 *                       - bool_option_text
 *                     valueBool:
 *                       type: boolean
 *                       nullable: true
 *                     valueOption:
 *                       type: string
 *                       nullable: true
 *                     valueText:
 *                       type: string
 *                       nullable: true
 *                 example:
 *                 - questionId: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   type: bool
 *                   valueBool: true
 *                 - questionId: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   type: option
 *                   valueOption: bueno
 *     responses:
 *       '200':
 *         description: Respuestas guardadas
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/ambulance/{id}:
 *   get:
 *     summary: Obtener checklist de ambulancia con respuestas
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     description: Incluye respuestas, preguntas, categorías y subcategorías relacionadas. Los campos
 *       name_category, order_category, name_subcategory y order_subcategory se calculan en el servicio
 *       para mantener compatibilidad.
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist de ambulancia
 *       schema:
 *         type: string
 *         format: uuid
 *     responses:
 *       '200':
 *         description: Checklist encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChecklistAmbulanceDetail'
 *             example:
 *               success: true
 *               data:
 *                 id: 36c23dc9-54a6-46a6-985b-e12135a8cb07
 *                 time: 02:51:48
 *                 km: 46
 *                 gas_path: sin utilizar
 *                 sign_deliverer_path: null
 *                 sign_recipient_path: null
 *                 notes: El notario
 *                 createdAt: '2026-05-20T02:51:48.000Z'
 *                 updatedAt: '2026-05-20T02:53:06.000Z'
 *                 ambulance:
 *                   id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   number: DF434F7
 *                 shift:
 *                   id: 89b576c4-e58a-499c-8bc3-5530e4464cdf
 *                   guard:
 *                     id: 160fc040-1612-438a-975f-ffcfa60614e3
 *                     date: '2026-05-20T00:00:00.000Z'
 *                     state: Cerrada
 *                     guardChief: &id001
 *                       id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                       name: Jefe Guardia
 *                       lastname: Seed
 *                   paramedical:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     name: Paramedico
 *                     lastname: Seed
 *                   driver:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     name: Chofer
 *                     lastname: Seed
 *                 recipient: *id001
 *                 deliverer: *id001
 *                 answers:
 *                 - id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   question:
 *                     id: 0e03b153-2a87-4357-9a30-95d31b6d2299
 *                     question: Limpieza de la unidad
 *                     category_id: 33333333-3333-4333-8333-333333333333
 *                     subcategory_id: null
 *                     order_question_category: 1
 *                     type_response: bool
 *                     category:
 *                       id: 33333333-3333-4333-8333-333333333333
 *                       name: Apariencia general
 *                       order: 1
 *                     subcategory: null
 *                     name_category: Apariencia general
 *                     order_category: 1
 *                     name_subcategory: null
 *                     order_subcategory: null
 *                   components:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     type: bool
 *                     value_bool: true
 *                     value_option: null
 *                     value_text: null
 *                 - id: 8ed1c998-1e9e-4fb7-8c90-a9049bb9da71
 *                   question:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     question: Licencia de conducir
 *                     category_id: 11111111-1111-4111-8111-111111111111
 *                     subcategory_id: 22222222-2222-4222-8222-222222222222
 *                     order_question_category: 1
 *                     type_response: bool
 *                     category:
 *                       id: 11111111-1111-4111-8111-111111111111
 *                       name: Compartimiento del operador
 *                       order: 2
 *                     subcategory:
 *                       id: 22222222-2222-4222-8222-222222222222
 *                       category_id: 11111111-1111-4111-8111-111111111111
 *                       name: Documentación
 *                       order: 1
 *                     name_category: Compartimiento del operador
 *                     order_category: 2
 *                     name_subcategory: Documentación
 *                     order_subcategory: 1
 *                   components:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     type: bool
 *                     value_bool: true
 *                     value_option: null
 *                     value_text: null
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
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
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - shiftId
 *             properties:
 *               shiftId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       '201':
 *         description: Checklist creado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 shift_id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 sign_deliverer_path: null
 *                 sign_recipient_path: null
 *                 createdAt: '2026-05-20T02:53:44.000Z'
 *                 updatedAt: '2026-05-20T02:53:44.000Z'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/supply/delete/{id}:
 *   delete:
 *     summary: Eliminar checklist de suministros
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist de suministros
 *       schema:
 *         type: string
 *         format: uuid
 *     responses:
 *       '200':
 *         description: Checklist eliminado correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/supply/{id}/sign:
 *   put:
 *     summary: Firmar checklist de suministros
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist de suministros
 *       schema:
 *         type: string
 *         format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - recipientId
 *             - delivererId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *               delivererId:
 *                 type: string
 *                 format: uuid
 *               notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       '200':
 *         description: Checklist firmado correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/supply/answers/{id}:
 *   put:
 *     summary: Guardar respuestas del checklist de suministros
 *     description: >
 *       Registra las cantidades físicas de suministros reportadas
 *       por el operador durante la revisión de una ambulancia.
 *       El sistema actualiza el inventario de la ambulancia y
 *       calcula automáticamente la cantidad faltante para alcanzar
 *       el mínimo establecido.
 *
 *       requiredQuantity = max(0, minQuantity - reportedQuantity).
 *     tags:
 *       - ENDPOINTS Gestión de Checklists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del checklist de suministros
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
 *                 minItems: 1
 *                 description: Suministros revisados por el operador
 *                 items:
 *                   type: object
 *                   required:
 *                     - supplyId
 *                     - reportedQuantity
 *                   properties:
 *                     supplyId:
 *                       type: string
 *                       format: uuid
 *                       description: ID del suministro asignado a la ambulancia
 *                     reportedQuantity:
 *                       type: integer
 *                       minimum: 0
 *                       description: Cantidad física encontrada por el operador
 *           example:
 *             answers:
 *               - supplyId: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 reportedQuantity: 2
 *     responses:
 *       '200':
 *         description: Respuestas guardadas correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       '400':
 *         description: Datos inválidos o suministro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/checklists/supply/{id}:
 *   get:
 *     summary: Obtener checklist de suministros por ID
 *     description: >
 *       Obtiene la información del checklist de suministros,
 *       incluyendo la ambulancia, el turno, los responsables,
 *       las firmas y las respuestas registradas.
 *       Cada respuesta contiene la cantidad mínima establecida,
 *       la cantidad reportada por el operador y la cantidad
 *       faltante calculada automáticamente.
 *     tags:
 *     - ENDPOINTS Gestión de Checklists
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: ID del checklist de suministros
 *       schema:
 *         type: string
 *         format: uuid
 *     responses:
 *       '200':
 *         description: Checklist de suministros encontrado
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 sign_deliverer_path: null
 *                 sign_recipient_path: null
 *                 notes: ''
 *                 createdAt: '2026-05-20T02:53:44.000Z'
 *                 updatedAt: '2026-05-20T02:59:41.000Z'
 *                 shift:
 *                   id: 89b576c4-e58a-499c-8bc3-5530e4464cdf
 *                   guard:
 *                     id: 160fc040-1612-438a-975f-ffcfa60614e3
 *                     date: '2026-05-20T00:00:00.000Z'
 *                     state: Cerrada
 *                     guardChief: &id001
 *                       id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                       name: Jefe Guardia
 *                       lastname: Seed
 *                   paramedical:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     name: Paramedico
 *                     lastname: Seed
 *                   driver:
 *                     id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                     name: Chofer
 *                     lastname: Seed
 *                 ambulance:
 *                   id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   number: DF434F7
 *                 recipient: *id001
 *                 deliverer: *id001
 *                 answers:
 *                 - id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   category: Estetoscopio
 *                   specification: Pediatrico
 *                   min_quantity: 3
 *                   reported_quantity: 2
 *                   required_quantity: 1
 *                   measurement_unit: unit
 *                   createdAt: '2026-05-20T02:59:41.000Z'
 *                   updatedAt: '2026-05-20T02:59:41.000Z'
 *                   area:
 *                     id: 1
 *                     name: EQUIPO DE VÍAS AÉREAS
 *                     section: GABINETE 1
 *                     order: 1
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
