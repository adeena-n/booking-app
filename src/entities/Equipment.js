import { EntitySchema } from "typeorm";

export const Equipment = new EntitySchema({
  name: "Equipment",
  tableName: "equipment",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    name: { type: "varchar" },
    category: { type: "varchar" },
    totalQuantity: { type: "int" },
    availableQuantity: { type: "int" },
    condition: { type: "varchar", default: "Good" },
    maintenanceStatus: { type: "varchar", default: "Operational" },
    createdAt: { type: "timestamptz", createDate: true },
    updatedAt: { type: "timestamptz", updateDate: true },
  },
  relations: {
    lab: {
      type: "many-to-one",
      target: "Lab",
      joinColumn: { name: "lab_id" },
      nullable: true,
    },
  },
});