import { AppDataSource } from "../config/data-source.js";
import { AppError } from "../utils/AppError.js";
import { STAFF_ROLES } from "../utils/constants.js";
import { checkAvailability } from "./availability/availability.service.js";

export async function createBooking(user, input) {
  return AppDataSource.transaction(async (manager) => {
    const isLab = input.resourceType === "lab";

    // Lock the lab/equipment row so two students cannot book the same slot at the same moment
    const locked = await manager.findOne(isLab ? "Lab" : "Equipment", {
      where: { id: isLab ? input.labId : input.equipmentId },
      lock: { mode: "pessimistic_write" },
    });
    if (!locked) throw new AppError(404, "NOT_FOUND", `${isLab ? "Lab" : "Equipment"} not found`);

    const result = await checkAvailability(manager, input);
    if (!result.available) {
      throw new AppError(409, "CONFLICT", result.reason, result);
    }

    const booking = manager.create("Booking", {
      user: { id: user.id },
      resourceType: input.resourceType,
      quantity: isLab ? 1 : input.quantity ?? 1,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      purpose: input.purpose,
      ...(isLab ? { lab: { id: input.labId } } : { equipment: { id: input.equipmentId } }),
    });
    return manager.save(booking);
  });
}

export async function listBookings(user, { status, resourceType }) {
  const where = {};
  if (status) where.bookingStatus = status;
  if (resourceType) where.resourceType = resourceType;
  // Students only see their own bookings
  if (!STAFF_ROLES.includes(user.role)) where.user = { id: user.id };

  return AppDataSource.getRepository("Booking").find({
    where,
    relations: { lab: true, equipment: true, user: true },
    order: { createdAt: "DESC" },
  });
}

export async function getBooking(user, id) {
  const booking = await AppDataSource.getRepository("Booking").findOne({
    where: { id },
    relations: { lab: true, equipment: true, user: true, approvedBy: true },
  });
  if (!booking) throw new AppError(404, "NOT_FOUND", "Booking not found");

  if (!STAFF_ROLES.includes(user.role) && booking.user.id !== user.id) {
    throw new AppError(403, "FORBIDDEN", "You can only view your own bookings");
  }
  return booking;
}