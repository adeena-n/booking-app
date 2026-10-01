import { app } from "./app.js";
import { env } from "./config/env.js";
import { AppDataSource } from "./config/data-source.js";

try {
  await AppDataSource.initialize();
  console.log("Database connected");
} catch (err) {
  console.error("Database connection failed:", err.code, err.message);
  process.exit(1);
}

app.listen(env.PORT, () => console.log(`API running on :${env.PORT}`));