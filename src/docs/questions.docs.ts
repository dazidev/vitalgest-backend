/**
 * @openapi
 * /api/questions/categories:
 *   get:
 *     tags:
 *       - ENDPOINTS Gestión de Preguntas
 *     summary: Obtener todas las categorías
 *     description: >
 *       Obtiene todas las categorías de preguntas
 *       ordenadas ascendentemente por el campo order.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Categorías obtenidas correctamente
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
 *                     $ref: '#/components/schemas/QuestionCategory'
 *             example:
 *               success: true
 *               data:
 *                 - id: "11111111-1111-4111-8111-111111111111"
 *                   name: "Apariencia general"
 *                   order: 1
 *                 - id: "22222222-2222-4222-8222-222222222222"
 *                   name: "Compartimiento del operador"
 *                   order: 2
 *       '401':
 *         description: No autorizado o token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     tags:
 *       - ENDPOINTS Gestión de Preguntas
 *     summary: Crear una categoría
 *     description: >
 *       Crea una nueva categoría de preguntas.
 *       El campo order se asigna automáticamente
 *       con la siguiente posición disponible.
 *       No se permiten nombres duplicados.
 *       Requiere rol admin o general_admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *                 description: Nombre de la categoría
 *                 example: "Equipo eléctrico"
 *           example:
 *             name: "Equipo eléctrico"
 *     responses:
 *       '201':
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionCategory'
 *             example:
 *               success: true
 *               data:
 *                 id: "33333333-3333-4333-8333-333333333333"
 *                 name: "Equipo eléctrico"
 *                 order: 10
 *       '400':
 *         description: Nombre faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "INVALID_QUESTION_CATEGORY_NAME"
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: La categoría ya existe o hay un conflicto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "QUESTION_CATEGORY_ALREADY_EXISTS"
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/questions/categories/{id}:
 *   get:
 *     tags:
 *       - ENDPOINTS Gestión de Preguntas
 *     summary: Obtener una categoría por ID
 *     description: >
 *       Obtiene la información de una categoría
 *       utilizando su identificador UUID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID de la categoría
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "11111111-1111-4111-8111-111111111111"
 *     responses:
 *       '200':
 *         description: Categoría encontrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionCategory'
 *             example:
 *               success: true
 *               data:
 *                 id: "11111111-1111-4111-8111-111111111111"
 *                 name: "Apariencia general"
 *                 order: 1
 *       '400':
 *         description: UUID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "INVALID_QUESTION_CATEGORY_ID"
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "QUESTION_CATEGORY_NOT_FOUND"
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     tags:
 *       - ENDPOINTS Gestión de Preguntas
 *     summary: Actualizar una categoría
 *     description: >
 *       Permite modificar el nombre y/o el orden
 *       de una categoría. Ambos campos son opcionales,
 *       pero se debe proporcionar al menos uno.
 *       Si cambia la posición, el sistema reorganiza
 *       automáticamente las demás categorías
 *       conservando órdenes consecutivos.
 *       Requiere rol admin o general_admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID de la categoría
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *                 description: Nuevo nombre de la categoría
 *                 example: "Equipo de seguridad"
 *               order:
 *                 type: integer
 *                 minimum: 1
 *                 description: >
 *                   Nueva posición de la categoría.
 *                   No puede superar el número
 *                   total de categorías existentes.
 *                 example: 2
 *           examples:
 *             updateName:
 *               summary: Cambiar solamente el nombre
 *               value:
 *                 name: "Equipo de seguridad"
 *             updateOrder:
 *               summary: Cambiar solamente el orden
 *               value:
 *                 order: 2
 *             updateAll:
 *               summary: Cambiar nombre y orden
 *               value:
 *                 name: "Equipo de seguridad"
 *                 order: 2
 *     responses:
 *       '200':
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionCategory'
 *             example:
 *               success: true
 *               data:
 *                 id: "11111111-1111-4111-8111-111111111111"
 *                 name: "Equipo de seguridad"
 *                 order: 2
 *       '400':
 *         description: >
 *           UUID, nombre u orden inválido, o solicitud
 *           sin campos para actualizar.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "INVALID_QUESTION_CATEGORY_ORDER"
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "QUESTION_CATEGORY_NOT_FOUND"
 *       '409':
 *         description: Nombre duplicado o conflicto de unicidad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "QUESTION_CATEGORY_ALREADY_EXISTS"
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags:
 *       - ENDPOINTS Gestión de Preguntas
 *     summary: Eliminar una categoría
 *     description: >
 *       Elimina una categoría únicamente si no tiene
 *       preguntas ni subcategorías asociadas.
 *       Después de la eliminación, las categorías
 *       restantes se reordenan automáticamente.
 *       Requiere rol admin o general_admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID de la categoría a eliminar
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Categoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *             example:
 *               success: true
 *       '400':
 *         description: UUID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "INVALID_QUESTION_CATEGORY_ID"
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "QUESTION_CATEGORY_NOT_FOUND"
 *       '409':
 *         description: >
 *           No se puede eliminar la categoría porque
 *           tiene preguntas o subcategorías asociadas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "QUESTION_CATEGORY_HAS_DEPENDENCIES"
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/questions/subcategories:
 *   get:
 *     summary: Obtener subcategorías de preguntas
 *     description: >
 *       Obtiene todas las subcategorías ordenadas por
 *       categoría y posición. Permite filtrar por categoría.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         description: UUID de la categoría a filtrar
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Subcategorías obtenidas
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
 *                     $ref: '#/components/schemas/QuestionSubcategory'
 *       400:
 *         description: Filtro inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 *
 *   post:
 *     summary: Crear subcategoría
 *     description: >
 *       Crea una subcategoría asociada a una categoría.
 *       El orden se asigna automáticamente.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - name
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *           example:
 *             categoryId: "11111111-1111-4111-8111-111111111111"
 *             name: "Documentación adicional"
 *     responses:
 *       201:
 *         description: Subcategoría creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionSubcategory'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: Subcategoría duplicada o conflicto
 */

/**
 * @openapi
 * /api/questions/subcategories/{id}:
 *   get:
 *     summary: Obtener subcategoría por ID
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID de la subcategoría
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Subcategoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionSubcategory'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Subcategoría no encontrada
 *
 *   put:
 *     summary: Actualizar subcategoría
 *     description: >
 *       Permite cambiar el nombre, orden o categoría.
 *       Los órdenes se reorganizan automáticamente.
 *       Solo permite cambiar de categoría cuando la
 *       subcategoría no tiene preguntas asociadas.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               order:
 *                 type: integer
 *                 minimum: 1
 *           examples:
 *             rename:
 *               summary: Cambiar nombre
 *               value:
 *                 name: "Documentación actualizada"
 *             reorder:
 *               summary: Cambiar posición
 *               value:
 *                 order: 2
 *             move:
 *               summary: Cambiar categoría
 *               value:
 *                 categoryId: "22222222-2222-4222-8222-222222222222"
 *                 order: 1
 *     responses:
 *       200:
 *         description: Subcategoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionSubcategory'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría o subcategoría no encontrada
 *       409:
 *         description: Duplicado o preguntas asociadas
 *
 *   delete:
 *     summary: Eliminar subcategoría
 *     description: >
 *       Elimina una subcategoría únicamente si no tiene
 *       preguntas asociadas. Reorganiza el orden restante
 *       dentro de su categoría.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Subcategoría eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Subcategoría no encontrada
 *       409:
 *         description: Subcategoría con preguntas asociadas
 */

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: Obtener preguntas
 *     description: >
 *       Lista las preguntas con sus categorías,
 *       subcategorías y posiciones. Permite filtrar
 *       por UUID de categoría y/o subcategoría.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: subcategoryId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
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
 *       400:
 *         description: Filtros inválidos
 *       401:
 *         description: No autorizado
 *
 *   post:
 *     summary: Crear pregunta
 *     description: >
 *       Crea una pregunta y asigna su orden
 *       automáticamente dentro de la categoría o
 *       subcategoría correspondiente.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - categoryId
 *               - typeResponse
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               subcategoryId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               typeResponse:
 *                 type: string
 *                 enum:
 *                   - bool
 *                   - option
 *                   - text
 *                   - bool_option
 *                   - bool_text
 *                   - option_text
 *                   - bool_option_text
 *           example:
 *             question: "¿Funcionan correctamente las luces?"
 *             categoryId: "11111111-1111-4111-8111-111111111111"
 *             subcategoryId: null
 *             typeResponse: bool
 *     responses:
 *       201:
 *         description: Pregunta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Categoría o subcategoría no encontrada
 *       409:
 *         description: Conflicto con las relaciones
 */

/**
 * @openapi
 * /api/questions/{id}:
 *   get:
 *     summary: Obtener pregunta por ID
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pregunta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pregunta no encontrada
 *
 *   put:
 *     summary: Editar pregunta
 *     description: >
 *       Permite modificar texto, tipo de respuesta,
 *       categoría, subcategoría y posición.
 *       No permite modificar preguntas con respuestas
 *       registradas en checklists.
 *       Si cambia la categoría y no se especifica
 *       subcategoryId, la pregunta queda sin subcategoría.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               subcategoryId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               typeResponse:
 *                 type: string
 *                 enum:
 *                   - bool
 *                   - option
 *                   - text
 *                   - bool_option
 *                   - bool_text
 *                   - option_text
 *                   - bool_option_text
 *               order:
 *                 type: integer
 *                 minimum: 1
 *           examples:
 *             rename:
 *               summary: Cambiar el texto
 *               value:
 *                 question: "¿Las luces funcionan?"
 *             reorder:
 *               summary: Cambiar de posición
 *               value:
 *                 order: 2
 *             move:
 *               summary: Cambiar de categoría
 *               value:
 *                 categoryId: "22222222-2222-4222-8222-222222222222"
 *                 subcategoryId: null
 *                 order: 1
 *     responses:
 *       200:
 *         description: Pregunta actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pregunta, categoría o subcategoría no encontrada
 *       409:
 *         description: Conflicto o pregunta con respuestas
 *
 *   delete:
 *     summary: Eliminar pregunta
 *     description: >
 *       Elimina una pregunta si no tiene respuestas
 *       registradas. Reorganiza las posiciones de
 *       las preguntas restantes en su grupo.
 *     tags: ['ENDPOINTS Gestión de Preguntas']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pregunta eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pregunta no encontrada
 *       409:
 *         description: La pregunta tiene respuestas asociadas
 */
