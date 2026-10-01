export const ROLES = {
  STUDENT: "student",
  STAFF: "lab_staff",
  COORDINATOR: "coordinator",
  ADMIN: "admin",
};

export const STAFF_ROLES = [ROLES.STAFF, ROLES.COORDINATOR, ROLES.ADMIN];

export const BOOKING_STATUS = {
  PENDING: "Pending Approval",
  APPROVED: "Approved",
  RESERVED: "Reserved",
  IN_USE: "In Use",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  OVERDUE: "Overdue",
  RETURNED_LATE: "Returned Late",
  DAMAGED: "Damaged",
};

// Only these statuses block a time slot
export const BLOCKING_STATUSES = [
  BOOKING_STATUS.APPROVED,
  BOOKING_STATUS.RESERVED,
  BOOKING_STATUS.IN_USE,
];