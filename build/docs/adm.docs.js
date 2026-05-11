"use strict";
/**
 * @openapi
 * /api/adm/create/user:
 *   post:
 *     summary: Crear usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 name: "Fernando"
 *                 lastname: "Garcia"
 *                 email: "garciafer@gmail.com"
 *                 password: "Secret123"
 *                 role: "admin"
 *                 status: true
 *                 position: "cargo"
 *                 delegationId: 1
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ResponseCreateUser' }
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @openapi
 * /api/adm/edit/user/{id}:
 *   put:
 *     summary: Editar usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 name: "Fernando"
 *                 lastname: "Garcia"
 *                 email: "garciafer@gmail.com"
 *                 role: "admin"
 *                 status: true
 *                 position: "cargo"
 *                 delegationId: 1
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     name: "Fernando"
 *                     lastname: "Garcia"
 *                     email: "garciafer@gmail.com"
 *                     role: "admin"
 *                     status: true
 *                     position: "cargo"
 *                     delegationId: 1
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
 * /api/adm/get/user/{id}:
 *   get:
 *     summary: Obtener usuario por id
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *
 *     responses:
 *       200:
 *         description: Usuario obtenido
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     name: "Fernando"
 *                     lastname: "Garcia"
 *                     email: "garciafer@gmail.com"
 *                     status: true
 *                     role: "admin"
 *                     position: "cargo"
 *                     delegationId: 1
 *                     createdAt: "2025-09-01T12:00:00Z"
 *                     updateAt: "2025-09-01T12:00:00Z"
 *       400:
 *         description: Usuario no encontrado
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
 * /api/adm/delete/user/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *       400:
 *         description: Usuario no encontrado
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
 * /api/adm/get-all/users:
 *   get:
 *     summary: Obtener usuarios
 *     description: >
 *       Obtiene la lista de usuarios registrados. Permite filtrar por rol y aplicar
 *       paginación mediante limit y offset. Si no se envían query params, devuelve
 *       todos los usuarios.
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - general_admin
 *             - admin
 *             - head_guard
 *             - vehicle_operator
 *             - paramedical
 *         description: Rol por el cual se desea filtrar la lista de usuarios.
 *         example: admin
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de usuarios a devolver.
 *         example: 2
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Número de usuarios que se deben omitir antes de empezar a devolver resultados.
 *         example: 2
 *
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente
 *         content:
 *           application/json:
 *             examples:
 *               withoutPagination:
 *                 summary: Respuesta sin paginación
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "da19f580-7bf4-4364-be48-7c5e2cc52e8a"
 *                       name: "Randy"
 *                       lastname: "Delgado"
 *                       email: "randy930529@gmail.com"
 *                       status: true
 *                       role: "admin"
 *                       position: "Developer"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-11T08:10:07.000Z"
 *                       updatedAt: "2026-05-11T09:03:59.000Z"
 *                     - id: "3f5d3291-4160-436d-a11d-785204291e50"
 *                       name: "Admin"
 *                       lastname: "Seed"
 *                       email: "adminseed@vitalgest.mx"
 *                       status: true
 *                       role: "general_admin"
 *                       position: "developer"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-10T21:42:36.000Z"
 *                       updatedAt: "2026-05-10T21:45:06.000Z"
 *
 *               withPagination:
 *                 summary: Respuesta con limit y offset
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "3f5d3291-4160-436d-a11d-785204291e50"
 *                       name: "Admin"
 *                       lastname: "Seed"
 *                       email: "adminseed@vitalgest.mx"
 *                       status: true
 *                       role: "general_admin"
 *                       position: "developer"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-10T21:42:36.000Z"
 *                       updatedAt: "2026-05-10T21:45:06.000Z"
 *                     - id: "871a1d2f-4f4b-42a6-ba17-22dc9a09a639"
 *                       name: "Chofer"
 *                       lastname: "Seed"
 *                       email: "choferseed@vitalgest.mx"
 *                       status: true
 *                       role: "vehicle_operator"
 *                       position: "Chofer"
 *                       delegation:
 *                         id: "63a5ed18-6bf9-4df8-a193-426d73d82dab"
 *                       createdAt: "2026-05-10T21:42:36.000Z"
 *                       updatedAt: "2026-05-10T21:42:36.000Z"
 *
 *       400:
 *         description: Datos inválidos. Puede ocurrir si el role, limit u offset no son válidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @openapi
 * /api/adm/change-password/user/{id}:
 *   put:
 *     summary: Cambiar contraseña de usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 password: "Fernando12qw#"
 *
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *       400:
 *         description: Usuario no encontrado
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
 * /api/auth/login/user:
 *   post:
 *     summary: Ingresar usuario
 *     tags: ['ENDPOINTS Autenticación']
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 email: "example@email.com"
 *                 password: "Fernando12qw#"
 *
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     name: "Fernando"
 *                     lastname: "Garcia"
 *                     email: "garciafer@gmail.com"
 *                     role: "admin"
 *                     status: true
 *                     position: "cargo"
 *                     delegationId: 1
 *
 *       400:
 *         description: Usuario no encontrado
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
 * /api/auth/refresh/token:
 *   post:
 *     summary: Ingresar usuario
 *     tags: ['ENDPOINTS Autenticación']
 *     security: [{ bearerAuth: [] }]
 *
 *     responses:
 *       200:
 *         description: Token enviado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   accessToken: "Token"
 *
 *       400:
 *         description: No token o invalido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
