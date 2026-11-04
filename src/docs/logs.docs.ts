/**
 * @openapi
 * /api/logs:
 *   get:
 *     tags:
 *       - ENDPOINTS Gestión de Logs
 *     summary: Obtener registros de auditoría
 *     description: >
 *       Obtiene los registros de auditoría del sistema, ordenados
 *       desde el más reciente hasta el más antiguo.
 *
 *       Permite filtrar por entidad, acción, usuario y fecha.
 *       Los filtros son opcionales y pueden combinarse.
 *
 *       La búsqueda de usuario (userSearch) examina nombre,
 *       apellido y correo electrónico. Si se proporcionan
 *       varias palabras, todas deben coincidir con alguno
 *       de esos campos.
 *
 *       Los parámetros from y to son inclusivos. Cuando se
 *       envían únicamente fechas YYYY-MM-DD, el intervalo
 *       se interpreta en UTC, desde las 00:00:00.000 hasta
 *       las 23:59:59.999 del día correspondiente.
 *
 *       El campo total representa el número de registros
 *       que cumplen los filtros, antes de aplicar la
 *       paginación. totalPages se calcula con base en limit.
 *
 *       Requiere un token JWT válido.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Número máximo de logs por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         example: 20
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Número de registros que se omiten.
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         example: 0
 *
 *       - in: query
 *         name: entity
 *         required: false
 *         description: Entidad sobre la que se realizó la acción.
 *         schema:
 *           type: string
 *           enum:
 *             - USER
 *             - DELEGATION
 *             - GUARD
 *             - SHIFT
 *             - AMBULANCE
 *             - AMBULANCE_SUPPLY
 *             - SUPPLY
 *             - AMBULANCE_CHECKLIST
 *             - SUPPLY_CHECKLIST
 *             - SUPPLY_REPORT
 *             - QUESTION_CATEGORY
 *             - QUESTION_SUBCATEGORY
 *             - QUESTION
 *         example: USER
 *
 *       - in: query
 *         name: action
 *         required: false
 *         description: >
 *           Código de la acción registrada. Debe corresponder
 *           a una acción válida del sistema y, cuando se
 *           indica entity, pertenecer a esa entidad.
 *           Los valores disponibles pueden consultarse
 *           mediante GET /api/logs/filters.
 *         schema:
 *           type: string
 *         example: CREATE_USER
 *
 *       - in: query
 *         name: userId
 *         required: false
 *         description: UUID del usuario que realizó la acción.
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "11111111-1111-4111-8111-111111111111"
 *
 *       - in: query
 *         name: userSearch
 *         required: false
 *         description: >
 *           Buscar por nombre, apellido o correo del usuario
 *           responsable. No puede estar vacío y admite
 *           un máximo de 100 caracteres. Los registros
 *           sin usuario asociado no coinciden con esta búsqueda.
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         example: "Admin"
 *
 *       - in: query
 *         name: from
 *         required: false
 *         description: >
 *           Fecha inicial inclusiva. Acepta YYYY-MM-DD o
 *           una fecha y hora ISO 8601.
 *         schema:
 *           type: string
 *         example: "2026-11-01"
 *
 *       - in: query
 *         name: to
 *         required: false
 *         description: >
 *           Fecha final inclusiva. Acepta YYYY-MM-DD o
 *           una fecha y hora ISO 8601. Debe ser igual
 *           o posterior a from.
 *         schema:
 *           type: string
 *         example: "2026-11-03"
 *
 *     responses:
 *       '200':
 *         description: Registros obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *                 - total
 *                 - limit
 *                 - offset
 *                 - totalPages
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: Registros de la página solicitada.
 *                   items:
 *                     type: object
 *                     required:
 *                       - id
 *                       - userId
 *                       - user
 *                       - affected
 *                       - entity
 *                       - action
 *                       - description
 *                       - createdAt
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         nullable: true
 *                       user:
 *                         type: object
 *                         nullable: true
 *                         description: >
 *                           Usuario responsable. Puede ser null
 *                           si no existe una asociación.
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           lastname:
 *                             type: string
 *                           email:
 *                             type: string
 *                             format: email
 *                       affected:
 *                         type: string
 *                         nullable: true
 *                         maxLength: 100
 *                         description: >
 *                           Identificador del objeto afectado.
 *                           No necesariamente es un UUID.
 *                       entity:
 *                         type: string
 *                         example: USER
 *                       action:
 *                         type: string
 *                         example: CREATE_USER
 *                       description:
 *                         type: string
 *                         example: Se creó un nuevo usuario.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   minimum: 0
 *                   description: Total de logs que cumplen los filtros.
 *                 limit:
 *                   type: integer
 *                   minimum: 1
 *                 offset:
 *                   type: integer
 *                   minimum: 0
 *                 totalPages:
 *                   type: integer
 *                   minimum: 0
 *
 *             examples:
 *               withResults:
 *                 summary: Consulta con resultados
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "22222222-2222-4222-8222-222222222222"
 *                       userId: "11111111-1111-4111-8111-111111111111"
 *                       user:
 *                         id: "11111111-1111-4111-8111-111111111111"
 *                         name: "Admin"
 *                         lastname: "Sistema"
 *                         email: "admin@example.com"
 *                       affected: "33333333-3333-4333-8333-333333333333"
 *                       entity: "USER"
 *                       action: "CREATE_USER"
 *                       description: "Se creó un nuevo usuario."
 *                       createdAt: "2026-11-03T18:30:00.000Z"
 *                   total: 1
 *                   limit: 20
 *                   offset: 0
 *                   totalPages: 1
 *
 *               emptyResults:
 *                 summary: Consulta sin resultados
 *                 value:
 *                   success: true
 *                   data: []
 *                   total: 0
 *                   limit: 20
 *                   offset: 0
 *                   totalPages: 0
 *
 *       '400':
 *         description: >
 *           Parámetros inválidos. Incluye INVALID_LIMIT,
 *           INVALID_OFFSET, INVALID_LOG_ENTITY,
 *           INVALID_LOG_ACTION, INVALID_LOG_USER_ID,
 *           INVALID_LOG_USER_SEARCH, INVALID_LOG_DATE
 *           e INVALID_LOG_DATE_RANGE.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "INVALID_LOG_ENTITY"
 *
 *       '401':
 *         description: Token JWT ausente, inválido o expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       '500':
 *         description: Error interno al consultar los registros.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/logs/filters:
 *   get:
 *     tags:
 *       - ENDPOINTS Gestión de Logs
 *     summary: Obtener filtros disponibles para los logs
 *     description: >
 *       Devuelve las entidades de auditoría disponibles y las
 *       acciones correspondientes a cada una.
 *
 *       Esta información permite construir filtros dinámicos
 *       sin mantener una lista de acciones en el frontend.
 *
 *       No recibe parámetros y requiere un token JWT válido.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       '200':
 *         description: Filtros obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   required:
 *                     - categories
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - entity
 *                           - actions
 *                         properties:
 *                           entity:
 *                             type: string
 *                             description: Código de la entidad.
 *                             example: USER
 *                           actions:
 *                             type: array
 *                             description: Acciones válidas para la entidad.
 *                             items:
 *                               type: string
 *
 *             examples:
 *               filters:
 *                 summary: Ejemplo de categorías y acciones
 *                 description: >
 *                   Ejemplo parcial. La respuesta real incluye
 *                   todas las entidades definidas en LogEntities.
 *                 value:
 *                   success: true
 *                   data:
 *                     categories:
 *                       - entity: "USER"
 *                         actions:
 *                           - "CREATE_USER"
 *                           - "UPDATE_USER"
 *                           - "DELETE_USER"
 *                           - "CHANGE_USER_PASSWORD"
 *                           - "RESET_USER_PASSWORD"
 *                           - "UPDATE_USER_SIGNATURE"
 *                       - entity: "SUPPLY_REPORT"
 *                         actions:
 *                           - "CREATE_SUPPLY_REPORT"
 *                           - "UPDATE_SUPPLY_REPORT_ITEMS"
 *                           - "ATTEND_SUPPLY_REPORT"
 *                       - entity: "QUESTION"
 *                         actions:
 *                           - "CREATE_QUESTION"
 *                           - "UPDATE_QUESTION"
 *                           - "DELETE_QUESTION"
 *
 *       '401':
 *         description: Token JWT ausente, inválido o expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
