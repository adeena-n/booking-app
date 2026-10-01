import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getMe } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the logged-in user's profile and role
 *     description: Creates a student profile automatically on first login.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", authenticateToken, getMe);

export default router;