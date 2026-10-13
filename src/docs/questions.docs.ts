/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: Obtener todas las preguntas para administración
 *     tags:
 *     - ENDPOINTS Gestión de Preguntas
 *     description: Listado para la tabla administrativa de preguntas, con categoría y subcategoría.
 *       Requiere la implementación actualizada de QuestionsService y registrar el router /api/questions.
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
