"use strict";
/**
 * @openapi
 * /api/supplies/create/pharmacy/{pharmacyId}:
 *   post:
 *     summary: Crear suministro en farmacia
 *     tags: ['ENDPOINTS Gestión de suministros']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: pharmacyId
 *         required: true
 *         description: ID de la farmacia en la que se creará el suministro
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 category: "Bolsa de válvula - mascarilla (BVM)"
 *                 specification: "Adulto"
 *                 avilableQuantity: "2"
 *                 expirationDate: "2027-10-10"
 *                 measurementUnit: "unit"
 *     responses:
 *       201:
 *         description: Suministro creado creado
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "cdac8062-7087-4990-a347-8aef353c4ce1"
 *                     category: "Bolsa de válvula - mascarilla (BVM)"
 *                     specification: "Adulto"
 *                     avialble_quantity: "2"
 *                     expiration_date: "2027-10-10T00:00:00.000Z"
 *                     measurement_unit: "unit"
 *                     pharmacy_id: "23de0993-bd95-460c-b68e-480d18b2da1a"
 *                     createdAt: "2025-11-06T20:42:29.325Z"
 *                     updatedAt: "2025-11-06T20:42:29.325Z"
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
 * /api/supplies/edit/{supplyId}:
 *   put:
 *     summary: Editar suministro en farmacia
 *     tags: ['ENDPOINTS Gestión de suministros']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: supplyId
 *         required: true
 *         description: ID del suministro que se desea editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             request:
 *               value:
 *                 category: "Bolsa de válvula"
 *                 specification: "niño"
 *                 avilableQuantity: 2
 *                 expirationDate: "2027-10-11"
 *                 measurementUnit: "lbs"
 *                 pharmacyId: "2ab30b87-fa26-4b52-9429-e8a686ac2be3"
 *     responses:
 *       200:
 *         description: Suministro actualizado correctamente
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
 */
/**
 * @openapi
 * /api/supplies/delete/{supplyId}:
 *   delete:
 *     summary: Eliminar suministro por ID
 *     tags: ['ENDPOINTS Gestión de suministros']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: supplyId
 *         required: true
 *         description: ID del suministro que se desea eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suministro eliminado correctamente
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
 */
/**
 * @openapi
 * /api/supplies/pharmacy/{pharmacyId}:
 *   get:
 *     summary: Obtener suministros de una farmacia
 *     tags: ['ENDPOINTS Gestión de suministros']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: pharmacyId
 *         required: true
 *         description: ID de la farmacia de la que se desean obtener los suministros
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de suministros de la farmacia
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "b34cb1cd-262d-4195-80ee-282de8ec7766"
 *                       category: "Bolsa de válvula"
 *                       specification: "niño"
 *                       avialble_quantity: 2
 *                       expiration_date: "2027-10-11T00:00:00.000Z"
 *                       measurement_unit: "lbs"
 *                       pharmacy_id: "2ab30b87-fa26-4b52-9429-e8a686ac2be3"
 *                       createdAt: "2025-11-07T00:24:21.000Z"
 *                       updatedAt: "2025-11-07T04:12:10.000Z"
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
 * /api/supplies/one/{supplyId}:
 *   get:
 *     summary: Obtener un suministro por ID
 *     tags: ['ENDPOINTS Gestión de suministros']
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: supplyId
 *         required: true
 *         description: ID del suministro que se desea consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suministro obtenido correctamente
 *         content:
 *           application/json:
 *             examples:
 *               response:
 *                 value:
 *                   success: true
 *                   data:
 *                     id: "b34cb1cd-262d-4195-80ee-282de8ec7766"
 *                     category: "Bolsa de válvula"
 *                     specification: "niño"
 *                     avialble_quantity: 2
 *                     expiration_date: "2027-10-11T00:00:00.000Z"
 *                     measurement_unit: "lbs"
 *                     pharmacy_id: "2ab30b87-fa26-4b52-9429-e8a686ac2be3"
 *                     createdAt: "2025-11-07T00:24:21.000Z"
 *                     updatedAt: "2025-11-07T04:12:10.000Z"
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
