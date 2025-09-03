import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { env } from "../env";

import { registerRestaurant } from "./routes/register-restaurant";
import { registerCustomer } from "./routes/register-customer";
import { sendAuthenticationLink } from "./routes/send-authentication-link";
import { createOrder } from "./routes/create-order";
import { approveOrder } from "./routes/approve-order";
import { cancelOrder } from "./routes/cancel-order";
import { getOrders } from "./routes/get-orders";
import { createEvaluation } from "./routes/create-evaluation";
import { getEvaluations } from "./routes/get-evaluations";
import { updateMenu } from "./routes/update-menu";
import { updateProfile } from "./routes/update-profile";
import { authentication } from "./authentication";
import { getProfile } from "./routes/get-profile";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { getManagedRestaurant } from "./routes/get-managed-restaurant";
import { signOut } from "./routes/sign-out";
import { getOrderDetails } from "./routes/get-order-details";
import { getMonthReceipt } from "./routes/get-month-receipt";
import { getMonthOrdersAmount } from "./routes/get-month-orders-amount";
import { getDayOrdersAmount } from "./routes/get-day-orders-amount";
import { getMonthCanceledOrdersAmount } from "./routes/get-month-canceled-orders-amount";
import { getDailyReceiptInPeriod } from "./routes/get-daily-receipt-in-period";
import { getPopularProducts } from "./routes/get-popular-products";
import { dispatchOrder } from "./routes/dispatch-order";
import { deliverOrder } from "./routes/deliver-order";

// Carrega dotenv em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("Environment variables loaded successfully");

console.log("Creating Elysia app...");
const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ["content-type"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      origin: (request): boolean => {
        const origin = request.headers.get("origin");

        if (!origin) {
          return false;
        }

        // Desenvolvimento
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
          return true;
        }

        // Produção (Render)
        if (origin.includes(".onrender.com")) {
          return true;
        }

        return false;
      },
    })
  )
  .use(() => {
    console.log("Loading authentication middleware...");
    return authentication;
  })
  .use(() => {
    console.log("Loading signOut route...");
    return signOut;
  })
  .use(() => {
    console.log("Loading getProfile route...");
    return getProfile;
  })
  .use(() => {
    console.log("Loading getManagedRestaurant route...");
    return getManagedRestaurant;
  })
  .use(() => {
    console.log("Loading registerRestaurant route...");
    return registerRestaurant;
  })
  .use(() => {
    console.log("Loading registerCustomer route...");
    return registerCustomer;
  })
  .use(() => {
    console.log("Loading sendAuthenticationLink route...");
    return sendAuthenticationLink;
  })
  .use(() => {
    console.log("Loading authenticateFromLink route...");
    return authenticateFromLink;
  })
  .use(() => {
    console.log("Loading createOrder route...");
    return createOrder;
  })
  .use(() => {
    console.log("Loading approveOrder route...");
    return approveOrder;
  })
  .use(() => {
    console.log("Loading cancelOrder route...");
    return cancelOrder;
  })
  .use(() => {
    console.log("Loading dispatchOrder route...");
    return dispatchOrder;
  })
  .use(() => {
    console.log("Loading deliverOrder route...");
    return deliverOrder;
  })
  .use(() => {
    console.log("Loading getOrders route...");
    return getOrders;
  })
  .use(() => {
    console.log("Loading getOrderDetails route...");
    return getOrderDetails;
  })
  .use(() => {
    console.log("Loading createEvaluation route...");
    return createEvaluation;
  })
  .use(() => {
    console.log("Loading getEvaluations route...");
    return getEvaluations;
  })
  .use(() => {
    console.log("Loading updateMenu route...");
    return updateMenu;
  })
  .use(() => {
    console.log("Loading updateProfile route...");
    return updateProfile;
  })
  .use(() => {
    console.log("Loading getMonthReceipt route...");
    return getMonthReceipt;
  })
  .use(() => {
    console.log("Loading getMonthOrdersAmount route...");
    return getMonthOrdersAmount;
  })
  .use(() => {
    console.log("Loading getDayOrdersAmount route...");
    return getDayOrdersAmount;
  })
  .use(() => {
    console.log("Loading getMonthCanceledOrdersAmount route...");
    return getMonthCanceledOrdersAmount;
  })
  .use(() => {
    console.log("Loading getDailyReceiptInPeriod route...");
    return getDailyReceiptInPeriod;
  })
  .use(() => {
    console.log("Loading getPopularProducts route...");
    return getPopularProducts;
  });

console.log("Routes configured successfully");

// Health check endpoint
app.get("/health", () => {
  return {
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };
});

console.log("Health check endpoint added");

app.onError(({ code, error, set }) => {
  console.error("Error:", code, error.message);

  switch (code) {
    case "VALIDATION": {
      set.status = error.status;
      return error.toResponse();
    }
    case "NOT_FOUND": {
      return new Response(null, { status: 404 });
    }
    default: {
      console.error("Unhandled error:", error);
      return new Response(null, { status: 500 });
    }
  }
});

console.log("Error handlers configured");

// Adicione handlers para erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Não sair imediatamente em produção para permitir recovery
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Não sair imediatamente em produção para permitir recovery
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

try {
  const port = process.env.PORT || 10000;
  console.log(`Starting server on port ${port}...`);
  console.log(`Environment variables:`, {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: env.DB_URL ? 'SET' : 'NOT SET',
    JWT_SECRET_KEY: env.JWT_SECRET_KEY ? 'SET' : 'NOT SET',
    API_BASE_URL: env.API_BASE_URL ? 'SET' : 'NOT SET'
  });

  console.log("About to start listening...");
  
  // Use Bun.serve for production environments
  if (typeof Bun !== 'undefined') {
    console.log("Using Bun.serve for production...");
    Bun.serve({
      port: port,
      fetch: app.fetch,
    });
    console.log(`🔥 HTTP server running on port ${port} with Bun...`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    console.log("Server started successfully with Bun!");
  } else {
    console.log("Using Node.js listen for development...");
    // Fallback for Node.js environments
    app.listen(port, () => {
      console.log(`🔥 HTTP server running on port ${port}...`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Health check available at: http://localhost:${port}/health`);
      console.log("Server started successfully with Node.js!");
    });
  }
  
  console.log("Listen call completed");
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
