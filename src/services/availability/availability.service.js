import { In, LessThan, MoreThan } from "typeorm";
import { AppError } from "../../utils/AppError.js";
import { BLOCKING_STATUSES } from "../../utils/constants.js";

const conflictInfo = (b) => ({
  bookingId: b.id,
  date: b.date,
  startTime: b.startTime,
  endTime: b.endTime,
});

export async function checkAvailability(manager, input) {
  const { resourceType, date, startTime, endTime } = input;

  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  if (date < today) {
    throw new AppError(400, "VALIDATION_ERROR", "You cannot book a date in the past");
  }

  // Two bookings overlap when: existingStart < newEnd AND existingEnd > newStart
  const overlapFilter = {
    date,
    bookingStatus: In(BLOCKING_STATUSES),
    startTime: LessThan(endTime),
    endTime: MoreThan(startTime),
  };

  if (resourceType === "lab") {
    const lab = await manager.findOne("Lab", { where: { id: input.labId } });
    if (!lab) throw new AppError(404, "NOT_FOUND", "Lab not found");

    if (["Maintenance", "Closed"].includes(lab.status)) {
      return { available: false, reason: `${lab.name} is currently ${lab.status} and cannot be booked` };
    }

    const overlapping = await manager.find("Booking", {
      where: { ...overlapFilter, lab: { id: lab.id } },
    });

    if (overlapping.length > 0) {
      return {
        available: false,
        reason: `${lab.name} is already booked during this time`,
        conflicts: overlapping.map(conflictInfo),
      };
    }
    return { available: true };
  }

  // Equipment
  const equipment = await manager.findOne("Equipment", { where: { id: input.equipmentId } });
  if (!equipment) throw new AppError(404, "NOT_FOUND", "Equipment not found");

  if (equipment.maintenanceStatus === "Under Maintenance") {
    return { available: false, reason: `${equipment.name} is under maintenance and cannot be booked` };
  }

  const quantity = input.quantity ?? 1;
  const overlapping = await manager.find("Booking", {
    where: { ...overlapFilter, equipment: { id: equipment.id } },
  });

  const reserved = overlapping.reduce((sum, b) => sum + b.quantity, 0);
  const remaining = equipment.availableQuantity - reserved;

  if (quantity > remaining) {
    return {
      available: false,
      reason: `Only ${Math.max(remaining, 0)} of ${equipment.name} available during this time (you requested ${quantity})`,
      remaining: Math.max(remaining, 0),
      conflicts: overlapping.map(conflictInfo),
    };
  }
  return { available: true, remaining: remaining - quantity };
}