import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ROLES } from "../utils/constants.js";
import {
  listLabsSchema, labIdSchema, createLabSchema, updateLabSchema,
} from "../schemas/lab.schema.js";
import * as ctrl from "../controllers/lab.controller.js";

const router = Router();
const canManage = requireRole(ROLES.STAFF, ROLES.COORDINATOR, ROLES.ADMIN);

/**
 * @openapi
 * /api/labs:
 *   get:
 *     tags: [Labs]
 *     summary: Search and filter labs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Reserved, In Use, Maintenance, Closed]
 *       - in: query
 *         name: departmentId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of labs
 *       401:
 *         description: Unauthenticated
 */
router.get("/", authenticate, validate(listLabsSchema), ctrl.listLabs);

/**
 * @openapi
 * /api/labs/{id}:
 *   get:
 *     tags: [Labs]
 *     summary: Get lab details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Lab details
 *       404:
 *         description: Lab not found
 */
router.get("/:id", authenticate, validate(labIdSchema), ctrl.getLab);

/**
 * @openapi
 * /api/labs:
 *   post:
 *     tags: [Labs]
 *     summary: Create a lab (staff, coordinator or admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LabInput'
 *     responses:
 *       201:
 *         description: Lab created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Role not allowed
 */
router.post("/", authenticate, canManage, validate(createLabSchema), ctrl.createLab);

/**
 * @openapi
 * /api/labs/{id}:
 *   patch:
 *     tags: [Labs]
 *     summary: Update a lab (staff, coordinator or admin only)
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
 *             $ref: '#/components/schemas/LabInput'
 *     responses:
 *       200:
 *         description: Lab updated
 *       403:
 *         description: Role not allowed
 *       404:
 *         description: Lab not found
 */
router.patch("/:id", authenticate, canManage, validate(updateLabSchema), ctrl.updateLab);

export default router;