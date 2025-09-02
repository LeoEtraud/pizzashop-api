import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

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

// Só carrega dotenv em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("API_BASE_URL:", process.env.API_BASE_URL);
console.log("AUTH_REDIRECT_URL:", process.env.AUTH_REDIRECT_URL);
console.log("DB_URL:", process.env.DB_URL ? "Present" : "Missing");

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
  .use(authentication)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(registerCustomer)
  .use(sendAuthenticationLink)
  .use(authenticateFromLink)
  .use(createOrder)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getOrderDetails)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(updateMenu)
  .use(updateProfile)
  .use(getMonthReceipt)
  .use(getMonthOrdersAmount)
  .use(getDayOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getDailyReceiptInPeriod)
  .use(getPopularProducts)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION": {
        set.status = error.status;

        return error.toResponse();
      }
      case "NOT_FOUND": {
        return new Response(null, { status: 404 });
      }
      default: {
        console.error(error);

        return new Response(null, { status: 500 });
      }
    }
  });

try {
  const port = process.env.PORT || 10000;
  app.listen(port, () => {
    console.log(`🔥 HTTP server running on port ${port}...`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
