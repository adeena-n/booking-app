import { z } from "zod";
import { BOOKING_STATUS } from "../utils/constants.js";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use format YYYY-MM-DD");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour format HH:MM");

const base = z.object({
  resourceType: z.enum(["lab", "equipment"]),
  labId: z.string().uuid().optional(),
  equipmentId: z.string().uuid().optional(),
  quantity: z.number().int().positive().optional(),
  date,
  startTime: time,
  endTime: time,
});

const rules = (b, ctx) => {
  if (b.endTime <= b.startTime) {
    ctx.addIssue({ code: "custom", path: ["endTime"], message: "endTime must be after startTime" });
  }
  if (b.resourceType === "lab" && !b.labId) {
    ctx.addIssue({ code: "custom", path: ["labId"], message: "labId is required for lab bookings" });
  }
  if (b.resourceType === "equipment" && !b.equipmentId) {
    ctx.addIssue({ code: "custom", path: ["equipmentId"], message: "equipmentId is required for equipment bookings" });
  }
};

export const checkAvailabilitySchema = z.object({
  body: base.superRefine(rules),
});

export const createBookingSchema = z.object({
  body: base.extend({ purpose: z.string().min(3) }).superRefine(rules),
});

export const listBookingsSchema = z.object({
  query: z.object({
    status: z.enum(Object.values(BOOKING_STATUS)).optional(),
    resourceType: z.enum(["lab", "equipment"]).optional(),
  }),
});

export const bookingIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});