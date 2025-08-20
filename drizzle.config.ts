// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/**/*.ts", // ajuste se seu path for outro
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!, // NUNCA importe src/env.ts aqui
  },
  strict: true,
});
