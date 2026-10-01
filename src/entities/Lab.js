import { EntitySchema } from "typeorm";

export const Lab = new EntitySchema({
  name: "Lab",
  tableName: "labs",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    name: { type: "varchar" },
    capacity: { type: "int" },
    location: { type: "varchar", nullable: true },
    facilities: { type: "text", array: true, default: () => "'{}'" },
    status: { type: "varchar", default: "Available" },
    createdAt: { type: "timestamptz", createDate: true },
    updatedAt: { type: "timestamptz", updateDate: true },
  },

  relations: {
    department: {
      type: "many-to-one",
      target: "Department",
      joinColumn: { name: "department_id" },
      nullable: true,
    },
  },
});