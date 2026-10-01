import { EntitySchema } from "typeorm";

export const Department = new EntitySchema({
  name: "Department",
  tableName: "departments",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    name: { type: "varchar", unique: true },
    description: { type: "text", nullable: true },
    createdAt: { type: "timestamptz", createDate: true },
  },
});