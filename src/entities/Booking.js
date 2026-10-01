import { EntitySchema } from "typeorm";

export const Booking = new EntitySchema({
  name: "Booking",
  tableName: "bookings",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    resourceType: { type: "varchar" },
    quantity: { type: "int", default: 1 },
    date: { type: "date" },
    startTime: { type: "time" },
    endTime: { type: "time" },
    purpose: { type: "text" },
    approvalStatus: { type: "varchar", default: "Pending" },
    bookingStatus: { type: "varchar", default: "Pending Approval" },
    createdAt: { type: "timestamptz", createDate: true },
    updatedAt: { type: "timestamptz", updateDate: true },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "UserProfile",
      joinColumn: { name: "user_id" },
      nullable: false,
    },
    lab: {
      type: "many-to-one",
      target: "Lab",
      joinColumn: { name: "lab_id" },
      nullable: true,
    },
    equipment: {
      type: "many-to-one",
      target: "Equipment",
      joinColumn: { name: "equipment_id" },
      nullable: true,
    },
    approvedBy: {
      type: "many-to-one",
      target: "UserProfile",
      joinColumn: { name: "approved_by" },
      nullable: true,
    },
  },
});