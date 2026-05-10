"use strict";
/**
 * @openapi
 * /api/user/change/password/{id}:
 *   patch:
 *     summary: Cambiar contraseña de usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPass
 *               - newPass
 *             properties:
 *               currentPass:
 *                 type: string
 *               newPass:
 *                 type: string
 *           examples:
 *             request:
 *               value:
 *                 currentPass: "passwordActual123"
 *                 newPass: "passwordNuevo123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
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
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @openapi
 * /api/user/change/info/{id}:
 *   patch:
 *     summary: Editar información de usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *           examples:
 *             request:
 *               value:
 *                 name: "Daniel"
 *                 lastname: "Zipa"
 *     responses:
 *       200:
 *         description: Información actualizada correctamente
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "43a06473-2862-4d1a-90af-6051f20d8509"
 *                     name: "Daniel"
 *                     lastname: "Zipa"
 *                     email: "daniel@mail.com"
 *                     rol: "admin"
 *                     signature: null
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
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
/**
 * @openapi
 * /api/user/{id}/upload/signature:
 *   get:
 *     summary: Generar URL para subir firma de usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mime
 *               - ext
 *               - size
 *             properties:
 *               mime:
 *                 type: string
 *                 enum: [image/jpeg, image/png, image/webp, image/jpg]
 *               ext:
 *                 type: string
 *                 example: "png"
 *               size:
 *                 type: number
 *                 example: 120000
 *           examples:
 *             request:
 *               value:
 *                 mime: "image/png"
 *                 ext: "png"
 *                 size: 120000
 *     responses:
 *       200:
 *         description: URL generada correctamente
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     uploadUrl: "https://example.r2.cloudflarestorage.com/users/signatures/images/43a06473-2862-4d1a-90af-6051f20d8509/1700000000000-file.png?X-Amz-Algorithm=AWS4-HMAC-SHA256"
 *                     key: "users/signatures/images/43a06473-2862-4d1a-90af-6051f20d8509/1700000000000-file.png"
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
 * /api/user/{id}/image/attach:
 *   patch:
 *     summary: Asociar imagen de firma al usuario
 *     tags: ['ENDPOINTS Gestión de usuarios']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *           examples:
 *             request:
 *               value:
 *                 key: "users/signatures/images/43a06473-2862-4d1a-90af-6051f20d8509/1700000000000-file.png"
 *     responses:
 *       200:
 *         description: Firma asociada correctamente
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
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
