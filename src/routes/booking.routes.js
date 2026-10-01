import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  checkAvailabilitySchema, createBookingSchema, listBookingsSchema, bookingIdSchema,
} from "../schemas/booking.schema.js";
import * as ctrl from "../controllers/booking.controller.js";

const router = Router();

/**
 * @openapi
 * /api/bookings/check-availability:
 *   post:
 *     tags: [Bookings]
 *     summary: Check if a lab or equipment is available for a date and time
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceType, date, startTime, endTime]
 *             properties:
 *               resourceType: { type: string, enum: [lab, equipment] }
 *               labId: { type: string, format: uuid }
 *               equipmentId: { type: string, format: uuid }
 *               quantity: { type: integer, example: 1 }
 *               date: { type: string, example: "2026-10-20" }
 *               startTime: { type: string, example: "13:00" }
 *               endTime: { type: string, example: "15:00" }
 *     responses:
 *       200:
 *         description: Result with available true or false and a reason
 *       400:
 *         description: Validation error
 *       404:
 *         description: Lab or equipment not found
 */
router.post("/check-availability", authenticate, validate(checkAvailabilitySchema), ctrl.check);

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a booking request (starts as Pending Approval)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceType, date, startTime, endTime, purpose]
 *             properties:
 *               resourceType: { type: string, enum: [lab, equipment] }
 *               labId: { type: string, format: uuid }
 *               equipmentId: { type: string, format: uuid }
 *               quantity: { type: integer, example: 1 }
 *               date: { type: string, example: "2026-10-20" }
 *               startTime: { type: string, example: "13:00" }
 *               endTime: { type: string, example: "15:00" }
 *               purpose: { type: string, example: "Embedded systems practical" }
 *     responses:
 *       201:
 *         description: Booking request created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Time slot or quantity not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authenticate, validate(createBookingSchema), ctrl.create);

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings (students see only their own)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: resourceType
 *         schema: { type: string, enum: [lab, equipment] }
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/", authenticate, validate(listBookingsSchema), ctrl.list);

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Booking details
 *       403:
 *         description: Not your booking
 *       404:
 *         description: Booking not found
 */
router.get("/:id", authenticate, validate(bookingIdSchema), ctrl.get);

export default router;