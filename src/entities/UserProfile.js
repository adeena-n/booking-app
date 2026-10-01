import { EntitySchema } from "typeorm";

export const UserProfile = new EntitySchema({
  name: "UserProfile",
  tableName: "user_profiles",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    authUserId: { type: "uuid", unique: true },
    name: { type: "varchar" },
    email: { type: "varchar" },
    role: { type: "varchar", default: "student" },
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