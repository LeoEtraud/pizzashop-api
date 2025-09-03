// src/http/server-minimal.ts
import { Elysia } from "elysia";

// src/env.ts
import { z } from "zod";
import { config } from "dotenv";
config();
var envSchema = z.object({
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  DB_URL: z.string().url().min(1),
  JWT_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string()
});
var env = envSchema.parse(process.env);

// src/http/server-minimal.ts
console.log("Environment variables loaded successfully");
var app = new Elysia().get("/health", () => {
  return {
    status: "OK",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: process.env.NODE_ENV || "development"
  };
}).onError(({ code, error, set }) => {
  console.error("Error:", code, error.message);
  return new Response(null, { status: 500 });
});
console.log("Minimal app configured");
try {
  const port = process.env.PORT || 1e4;
  console.log(`Starting minimal server on port ${port}...`);
  console.log(`Environment variables:`, {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: env.DB_URL ? "SET" : "NOT SET",
    JWT_SECRET_KEY: env.JWT_SECRET_KEY ? "SET" : "NOT SET",
    API_BASE_URL: env.API_BASE_URL ? "SET" : "NOT SET"
  });
  console.log("About to start listening...");
  app.listen(port, () => {
    console.log(`\u{1F525} Minimal HTTP server running on port ${port}...`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    console.log("Minimal server started successfully!");
  });
  console.log("Listen call completed");
} catch (error) {
  console.error("Failed to start minimal server:", error);
  process.exit(1);
}
