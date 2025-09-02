import {
  source_default
} from "../chunk-HDJPG3PP.js";
import {
  env
} from "../chunk-2V7TP353.js";
import "../chunk-MLKGABMK.js";

// src/db/migrate.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
var connection = postgres(env.DB_URL, { max: 1 });
var db = drizzle(connection);
await migrate(db, { migrationsFolder: "drizzle" });
console.log(source_default.greenBright("Migrations applied successfully!"));
await connection.end();
process.exit();
