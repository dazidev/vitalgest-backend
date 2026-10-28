/**
 * @openapi
 * /api/supply-reports:
 *   get:
 *     summary: Obtener reportes de reabastecimiento
 *     description: >
 *       Obtiene los reportes generados al firmar los checklists
 *       de suministros. Incluye la ambulancia, el estado,
 *       las fechas y los suministros faltantes agrupados
 *       por área y gabinete.
 *
 *       Las cantidades actuales y faltantes son calculadas
 *       a partir de los valores registrados en el reporte.
 *       No representan una verificación física del inventario.
 *
 *       Permite paginación mediante limit y offset.
 *       La propiedad total indica la cantidad total de reportes.
 *     tags:
 *       - ENDPOINTS Reportes de reabastecimiento
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Cantidad máxima de reportes a devolver
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Número de reportes que se deben omitir
 *         schema:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *     responses:
 *       '200':
 *         description: Reportes obtenidos correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: d3ae8cd2-f121-4893-974e-773509d6e7e0
 *                   checklist_id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   ambulance:
 *                     id: 89b576c4-e58a-499c-8bc3-5530e4464cdf
 *                     number: AMB-01
 *                   status: pending
 *                   attended_at: null
 *                   createdAt: '2026-10-27T18:00:00.000Z'
 *                   updatedAt: '2026-10-27T18:00:00.000Z'
 *                   areas:
 *                     - area_id: 1
 *                       area_name: EQUIPO DE VÍAS AÉREAS
 *                       section: GABINETE 1
 *                       order: 1
 *                       supplies:
 *                         - id: 160fc040-1612-438a-975f-ffcfa60614e3
 *                           category: Mascarilla
 *                           specification: Adulto
 *                           measurement_unit: unit
 *                           min_quantity: 3
 *                           reported_quantity: 2
 *                           required_quantity: 1
 *                           added_quantity: 0
 *                           current_quantity: 2
 *                           remaining_quantity: 1
 *                           is_resolved: false
 *               total: 1
 *       '400':
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/supply-reports/{id}/supplies:
 *   put:
 *     summary: Registrar reabastecimiento de suministros
 *     description: >
 *       Registra las unidades que el encargado declara haber
 *       agregado a uno o varios suministros de un reporte.
 *
 *       addedQuantity representa la cantidad total agregada
 *       para cada suministro. Si se actualiza nuevamente,
 *       el valor anterior será reemplazado, no acumulado.
 *
 *       El sistema calcula current_quantity sumando
 *       reported_quantity y added_quantity.
 *       Calcula remaining_quantity como el máximo entre
 *       cero y min_quantity menos current_quantity.
 *
 *       is_resolved indica si se alcanzó la cantidad mínima.
 *       Los suministros omitidos conservan sus valores anteriores.
 *
 *       Esta operación es informativa y no modifica
 *       los inventarios de farmacia ni de ambulancia.
 *     tags:
 *       - ENDPOINTS Reportes de reabastecimiento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del reporte de reabastecimiento
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
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: Suministros que se desean actualizar
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemId
 *                     - addedQuantity
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       format: uuid
 *                       description: ID del suministro dentro del reporte
 *                     addedQuantity:
 *                       type: integer
 *                       minimum: 0
 *                       description: >
 *                         Cantidad total declarada como agregada.
 *                         Reemplaza el valor previamente registrado.
 *           example:
 *             items:
 *               - itemId: 43a06473-2862-4d1a-90af-6051f20d8509
 *                 addedQuantity: 4
 *               - itemId: 160fc040-1612-438a-975f-ffcfa60614e3
 *                 addedQuantity: 1
 *     responses:
 *       '200':
 *         description: Cantidades registradas correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 43a06473-2862-4d1a-90af-6051f20d8509
 *                   category: Estetoscopio
 *                   min_quantity: 3
 *                   reported_quantity: 2
 *                   required_quantity: 1
 *                   added_quantity: 4
 *                   current_quantity: 6
 *                   remaining_quantity: 0
 *                   is_resolved: true
 *                 - id: 160fc040-1612-438a-975f-ffcfa60614e3
 *                   category: Mascarilla
 *                   min_quantity: 5
 *                   reported_quantity: 2
 *                   required_quantity: 3
 *                   added_quantity: 1
 *                   current_quantity: 3
 *                   remaining_quantity: 2
 *                   is_resolved: false
 *       '400':
 *         description: Solicitud inválida o recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/supply-reports/{id}/attend:
 *   put:
 *     summary: Marcar reporte de reabastecimiento como atendido
 *     description: >
 *       Cambia el estado del reporte de pending a attended
 *       y registra la fecha de atención.
 *
 *       No es obligatorio que todos los suministros estén
 *       resueltos para marcar el reporte como atendido.
 *
 *       Si el reporte ya se encuentra atendido,
 *       conserva la fecha original de atención.
 *
 *       Esta operación no modifica los inventarios
 *       ni las cantidades registradas de los suministros.
 *     tags:
 *       - ENDPOINTS Reportes de reabastecimiento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del reporte de reabastecimiento
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Reporte marcado como atendido
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: d3ae8cd2-f121-4893-974e-773509d6e7e0
 *                 status: attended
 *                 attended_at: '2026-10-27T23:00:00.000Z'
 *       '400':
 *         description: Identificador inválido o reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
