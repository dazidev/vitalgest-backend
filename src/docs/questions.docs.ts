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
