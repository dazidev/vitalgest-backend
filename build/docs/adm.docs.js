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
 *                 position: "cargo"
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
 *                 state: "true or false"
 *                 position: "cargo"
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
 *                     position: "cargo"
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
 *                     role: "admin"
 *                     position: "cargo"
 *                     state: "true"
 *                     createdat: "2025-09-01T12:00:00Z"
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
 * /api/adm/get-all/users/{amount}:
 *   get:
 *     summary: Obtener usuarios
 *     tags: ['ENDPOINTS Gestión de usuarios']
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
 *                       role: "admin"
 *                       position: "cargo"
 *                       state: "true"
 *                       createdat: "2025-09-01T12:00:00Z"
 *                     - id: "c1c9c5b2-9e9c-4a4e-9d77-0b9b7e8a1a23"
 *                       name: "Lucia"
 *                       lastname: "Perez"
 *                       email: "lucia.perez@example.com"
 *                       role: "user"
 *                       position: "cargo"
 *                       state: "true"
 *                       createdat: "2025-08-20T08:30:00Z"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
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
 *                     position: "cargo"
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
