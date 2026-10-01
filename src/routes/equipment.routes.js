import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../utils/constants.js";
import {
  listEquipmentSchema, equipmentIdSchema, createEquipmentSchema, updateEquipmentSchema,
} from "../schemas/equipment.schema.js";
import * as ctrl from "../controllers/equipment.controller.js";

const router = Router();
const canManage = requireRole(ROLES.STAFF, ROLES.COORDINATOR, ROLES.ADMIN);

/**
 * @openapi
 * /api/equipment:
 *   get:
 *     tags: [Equipment]
 *     summary: Search and filter equipment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: labId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: maintenanceStatus
 *         schema:
 *           type: string
 *           enum: [Operational, Under Maintenance]
 *     responses:
 *       200:
 *         description: List of equipment
 */
router.get("/", authenticate, validate(listEquipmentSchema), ctrl.listEquipment);

/**
 * @openapi
 * /api/equipment/{id}:
 *   get:
 *     tags: [Equipment]
 *     summary: Get equipment details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Equipment details
 *       404:
 *         description: Equipment not found
 */
router.get("/:id", authenticate, validate(equipmentIdSchema), ctrl.getEquipment);

/**
 * @openapi
 * /api/equipment:
 *   post:
 *     tags: [Equipment]
 *     summary: Create equipment (staff, coordinator or admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, totalQuantity]
 *             properties:
 *               name: { type: string, example: Oscilloscope }
 *               category: { type: string, example: Electronics }
 *               totalQuantity: { type: integer, example: 10 }
 *               availableQuantity: { type: integer, example: 10 }
 *               condition: { type: string, enum: [Good, Fair, Poor, Damaged] }
 *               maintenanceStatus: { type: string, enum: [Operational, Under Maintenance] }
 *               labId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Equipment created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Role not allowed
 */
router.post("/", authenticate, canManage, validate(createEquipmentSchema), ctrl.createEquipment);

/**
 * @openapi
 * /api/equipment/{id}:
 *   patch:
 *     tags: [Equipment]
 *     summary: Update equipment (staff, coordinator or admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               totalQuantity: { type: integer }
 *               availableQuantity: { type: integer }
 *               condition: { type: string, enum: [Good, Fair, Poor, Damaged] }
 *               maintenanceStatus: { type: string, enum: [Operational, Under Maintenance] }
 *               labId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Equipment updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Role not allowed
 *       404:
 *         description: Equipment not found
 */
router.patch("/:id", authenticate, canManage, validate(updateEquipmentSchema), ctrl.updateEquipment);

export default router;