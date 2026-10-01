import { DataSource } from "typeorm";
import { env } from "./env.js";
import { entities } from "../entities/index.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities,
  synchronize: env.NODE_ENV === "development",
});