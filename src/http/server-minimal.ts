import { Elysia } from "elysia";
import { env } from "../env";

console.log("Environment variables loaded successfully");

const app = new Elysia()
  .get("/health", () => {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };
  })
  .onError(({ code, error, set }) => {
    console.error("Error:", code, error.message);
    return new Response(null, { status: 500 });
  });

console.log("Minimal app configured");

try {
  const port = process.env.PORT || 10000;
  console.log(`Starting minimal server on port ${port}...`);
  console.log(`Environment variables:`, {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: env.DB_URL ? 'SET' : 'NOT SET',
    JWT_SECRET_KEY: env.JWT_SECRET_KEY ? 'SET' : 'NOT SET',
    API_BASE_URL: env.API_BASE_URL ? 'SET' : 'NOT SET'
  });

  console.log("About to start listening...");
  
  app.listen(port, () => {
    console.log(`🔥 Minimal HTTP server running on port ${port}...`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    console.log("Minimal server started successfully!");
  });
  
  console.log("Listen call completed");
} catch (error) {
  console.error("Failed to start minimal server:", error);
  process.exit(1);
}
