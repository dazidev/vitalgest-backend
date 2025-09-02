/**
 * @openapi
 * /api/adm/create/user:
 *   post:
 *     summary: Crear usuario
 *     tags: [ENDPOINTS Gestión de usuarios]
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
 *                 rol: "admin"
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

/**
 * @openapi
 * /api/adm/edit/user/:id:
 *   put:
 *     summary: Editar usuario
 *     tags: [ENDPOINTS Gestión de usuarios]
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
 *                 rol: "admin"
 *                 state: "0 or 1"
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
 *                     rol: "admin"
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
 * /api/adm/delete/user/:id:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [ENDPOINTS Gestión de usuarios]
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
 * /api/adm/get-all/users/:amount:
 *   get:
 *     summary: Obtener usuarios
 *     tags: [ENDPOINTS Gestión de usuarios]
 *     security: [{ bearerAuth: [] }]
 *     
 *     responses:
 *       200:
 *         description: Usuarios
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                       name: "Fernando"
 *                       lastname: "Garcia"
 *                       email: "garciafer@gmail.com"
 *                       rol: "admin"
 *                       state: 1
 *                       createdat: "2025-09-01T12:00:00Z"
 *                     - id: "c1c9c5b2-9e9c-4a4e-9d77-0b9b7e8a1a23"
 *                       name: "Lucia"
 *                       lastname: "Perez"
 *                       email: "lucia.perez@example.com"
 *                       rol: "user"
 *                       state: 0
 *                       createdat: "2025-08-20T08:30:00Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
