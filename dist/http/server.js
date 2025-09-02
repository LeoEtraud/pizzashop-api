import {
  authLinks,
  db,
  evaluations,
  orderItems,
  orders,
  products,
  restaurants,
  users
} from "../chunk-ARGQJQZ5.js";
import {
  NotAManagerError,
  UnauthorizedError,
  authentication
} from "../chunk-ZSFIHVBW.js";
import {
  env
} from "../chunk-2V7TP353.js";
import {
  transporter
} from "../chunk-TZ65GFMC.js";
import {
  minutes
} from "../chunk-T7CZ4KH4.js";
import "../chunk-MLKGABMK.js";

// src/http/server.ts
import { Elysia as Elysia25 } from "elysia";
import { cors } from "@elysiajs/cors";

// src/http/routes/register-restaurant.ts
import Elysia, { t } from "elysia";
var registerRestaurant = new Elysia().post(
  "/restaurants",
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body;
    const [manager] = await db.insert(users).values({
      name: managerName,
      email,
      phone,
      role: "manager"
    }).returning();
    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id
    });
    set.status = 204;
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      phone: t.String(),
      email: t.String({ format: "email" })
    })
  }
);

// src/http/routes/register-customer.ts
import Elysia2 from "elysia";
import { z } from "zod";
var registerCustomerBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string(),
  email: z.string().email()
});
var registerCustomer = new Elysia2().post(
  "/customers",
  async ({ body, set }) => {
    const { name, phone, email } = registerCustomerBodySchema.parse(body);
    await db.insert(users).values({
      name,
      email,
      phone
    });
    set.status = 401;
  }
);

// src/http/routes/send-authentication-link.tsx
import Elysia3, { t as t2 } from "elysia";
import { createId } from "@paralleldrive/cuid2";
import { render } from "@react-email/render";

// src/mail/templates/authentication-magic-link.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
import { jsx, jsxs } from "react/jsx-runtime";
function AuthenticationMagicLinkTemplate({
  userEmail,
  authLink,
  appName = "Pizza Shop",
  expiresInMinutes = 15
}) {
  const previewText = `Fa\xE7a login na ${appName}`;
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: previewText }),
    /* @__PURE__ */ jsx(Tailwind, { children: /* @__PURE__ */ jsx(Body, { className: "bg-white my-auto mx-auto font-sans", children: /* @__PURE__ */ jsxs(Container, { className: "border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]", children: [
      /* @__PURE__ */ jsx(Section, { className: "mt-[32px] text-center", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F355}" }) }),
      /* @__PURE__ */ jsxs(Heading, { className: "text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0", children: [
        "Fa\xE7a login na ",
        appName
      ] }),
      /* @__PURE__ */ jsxs(Text, { className: "text-black text-[14px] leading-[24px]", children: [
        "Voc\xEA solicitou um link para login na ",
        appName,
        " atrav\xE9s do e-mail",
        " ",
        /* @__PURE__ */ jsx("strong", { children: userEmail }),
        "."
      ] }),
      /* @__PURE__ */ jsxs(Text, { className: "text-black text-[14px] leading-[24px]", children: [
        "Este link expira em ",
        /* @__PURE__ */ jsxs("strong", { children: [
          expiresInMinutes,
          " minuto(s)"
        ] }),
        "."
      ] }),
      /* @__PURE__ */ jsx(Section, { className: "text-center mt-[32px] mb-[32px]", children: /* @__PURE__ */ jsx(
        Button,
        {
          className: "bg-sky-500 rounded text-white px-5 py-3 text-[12px] font-semibold no-underline text-center",
          href: authLink,
          children: "Entrar agora"
        }
      ) }),
      /* @__PURE__ */ jsxs(Text, { className: "text-black text-[14px] leading-[24px]", children: [
        "ou copie a URL abaixo e cole em seu navegador:",
        " ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: authLink,
            className: "text-sky-500 no-underline break-all",
            children: authLink
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Hr, { className: "border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" }),
      /* @__PURE__ */ jsx(Text, { className: "text-[#666666] text-[12px] leading-[24px]", children: "Se voc\xEA n\xE3o solicitou esse link de autentica\xE7\xE3o, apenas descarte este e-mail." })
    ] }) }) })
  ] });
}

// src/http/routes/send-authentication-link.tsx
var sendAuthenticationLink = new Elysia3().post(
  "/authenticate",
  async ({ body }) => {
    const { email } = body;
    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq: eq15 }) {
        return eq15(fields.email, email);
      }
    });
    if (!userFromEmail) {
      throw new UnauthorizedError();
    }
    const authLinkCode = createId();
    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
      expiresAt: new Date(Date.now() + minutes(15))
      // expira em 15min
    });
    const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);
    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);
    console.log("Magic link:", authLink.toString());
    const html = await render(
      AuthenticationMagicLinkTemplate({
        userEmail: email,
        authLink: authLink.toString(),
        appName: "Pizza Shop",
        expiresInMinutes: 15
      })
    );
    const text = await render(
      AuthenticationMagicLinkTemplate({
        userEmail: email,
        authLink: authLink.toString(),
        appName: "Pizza Shop",
        expiresInMinutes: 15
      }),
      { plainText: true }
    );
    await transporter.sendMail({
      from: `"Pizza Shop" <${env.SMTP_USER}>`,
      to: email,
      subject: "[Pizza Shop] Seu link de acesso",
      html,
      text
      // opcional, mas recomendado
    });
    return { message: "E-mail enviado (verifique sua caixa de entrada)" };
  },
  {
    body: t2.Object({
      email: t2.String({ format: "email" })
    })
  }
);

// src/http/routes/create-order.ts
import Elysia4, { t as t3 } from "elysia";
var createOrder = new Elysia4().use(authentication).post(
  "/restaurants/:restaurantId/orders",
  async ({ params, body, getCurrentUser, set }) => {
    const { sub: customerId } = await getCurrentUser();
    const { restaurantId } = params;
    const { items } = body;
    const productsIds = items.map((item) => item.productId);
    const products2 = await db.query.products.findMany({
      where(fields, { eq: eq15, and: and9, inArray: inArray2 }) {
        return and9(
          eq15(fields.restaurantId, restaurantId),
          inArray2(fields.id, productsIds)
        );
      }
    });
    const orderProducts = items.map((item) => {
      const product = products2.find((product2) => product2.id === item.productId);
      if (!product) {
        throw new Error("Not all products are available in this restaurant.");
      }
      return {
        productId: item.productId,
        unitPriceInCents: product.priceInCents,
        quantity: item.quantity,
        subtotalInCents: item.quantity * product.priceInCents
      };
    });
    const totalInCents = orderProducts.reduce((total, orderItem) => {
      return total + orderItem.subtotalInCents;
    }, 0);
    await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        totalInCents,
        customerId,
        restaurantId
      }).returning({
        id: orders.id
      });
      await tx.insert(orderItems).values(
        orderProducts.map((orderProduct) => {
          return {
            orderId: order.id,
            productId: orderProduct.productId,
            priceInCents: orderProduct.unitPriceInCents,
            quantity: orderProduct.quantity
          };
        })
      );
    });
    set.status = 201;
  },
  {
    body: t3.Object({
      items: t3.Array(
        t3.Object({
          productId: t3.String(),
          quantity: t3.Integer()
        })
      )
    }),
    params: t3.Object({
      restaurantId: t3.String()
    })
  }
);

// src/http/routes/approve-order.ts
import Elysia5, { t as t4 } from "elysia";
import { eq } from "drizzle-orm";
var approveOrder = new Elysia5().use(authentication).patch(
  "/orders/:id/approve",
  async ({ getManagedRestaurantId, set, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId();
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq15, and: and9 }) {
        return and9(
          eq15(fields.id, orderId),
          eq15(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    if (order.status !== "pending") {
      set.status = 400;
      return { message: "Order was already approved before." };
    }
    await db.update(orders).set({
      status: "processing"
    }).where(eq(orders.id, orderId));
    set.status = 204;
  },
  {
    params: t4.Object({
      id: t4.String()
    })
  }
);

// src/http/routes/cancel-order.ts
import Elysia6, { t as t5 } from "elysia";
import { eq as eq2 } from "drizzle-orm";
var cancelOrder = new Elysia6().use(authentication).patch(
  "/orders/:id/cancel",
  async ({ getCurrentUser, set, params }) => {
    const { id: orderId } = params;
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      set.status = 401;
      throw new Error("User is not a restaurant manager.");
    }
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq15, and: and9 }) {
        return and9(
          eq15(fields.id, orderId),
          eq15(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      set.status = 401;
      throw new Error("Order not found under the user managed restaurant.");
    }
    if (!["pending", "processing"].includes(order.status)) {
      set.status = 400;
      return {
        code: "STATUS_NOT_VALID",
        message: "O pedido n\xE3o pode ser cancelado depois de ser enviado."
      };
    }
    await db.update(orders).set({
      status: "canceled"
    }).where(eq2(orders.id, orderId));
    set.status = 204;
  },
  {
    params: t5.Object({
      id: t5.String()
    })
  }
);

// src/http/routes/get-orders.ts
import Elysia7, { t as t6 } from "elysia";
import { eq as eq3, and, ilike, desc, count, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-typebox";
var getOrders = new Elysia7().use(authentication).get(
  "/orders",
  async ({ query, getCurrentUser, set }) => {
    const { pageIndex, orderId, customerName, status } = query;
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      set.status = 401;
      throw new Error("User is not a restaurant manager.");
    }
    const baseQuery = db.select({
      orderId: orders.id,
      createdAt: orders.createdAt,
      status: orders.status,
      customerName: users.name,
      total: orders.totalInCents
    }).from(orders).innerJoin(users, eq3(users.id, orders.customerId)).where(
      and(
        eq3(orders.restaurantId, restaurantId),
        orderId ? ilike(orders.id, `%${orderId}%`) : void 0,
        status ? eq3(orders.status, status) : void 0,
        customerName ? ilike(users.name, `%${customerName}%`) : void 0
      )
    );
    const [ordersCount] = await db.select({ count: count() }).from(baseQuery.as("baseQuery"));
    const allOrders = await baseQuery.offset(pageIndex * 10).limit(10).orderBy((fields) => {
      return [
        sql`CASE ${fields.status} 
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'delivering' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'canceled' THEN 99
          END`,
        desc(fields.createdAt)
      ];
    });
    const result = {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: ordersCount.count
      }
    };
    return result;
  },
  {
    query: t6.Object({
      customerName: t6.Optional(t6.String()),
      orderId: t6.Optional(t6.String()),
      status: t6.Optional(createSelectSchema(orders).properties.status),
      pageIndex: t6.Numeric({ minimum: 0 })
    })
  }
);

// src/http/routes/create-evaluation.ts
import Elysia8, { t as t7 } from "elysia";
var createEvaluation = new Elysia8().use(authentication).post(
  "/evaluations",
  async ({ body, getCurrentUser, set }) => {
    const { sub: userId } = await getCurrentUser();
    const { restaurantId, rate, comment } = body;
    await db.insert(evaluations).values({
      restaurantId,
      customerId: userId,
      rate,
      comment
    });
    set.status = 201;
  },
  {
    body: t7.Object({
      restaurantId: t7.String(),
      rate: t7.Integer({ minimum: 1, maximum: 5 }),
      comment: t7.Optional(t7.String())
    })
  }
);

// src/http/routes/get-evaluations.ts
import Elysia9, { t as t8 } from "elysia";
import { z as z2 } from "zod";
var getEvaluations = new Elysia9().use(authentication).get(
  "/evaluations",
  async ({ query, set, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      set.status = 401;
      throw new Error("User is not a restaurant manager.");
    }
    const { pageIndex } = z2.object({
      pageIndex: z2.coerce.number().default(0)
    }).parse(query);
    const evaluations2 = await db.query.evaluations.findMany({
      offset: pageIndex * 10,
      limit: 10,
      orderBy: (evaluations3, { desc: desc2 }) => desc2(evaluations3.createdAt)
    });
    return evaluations2;
  },
  {
    query: t8.Object({
      pageIndex: t8.Numeric({ minimum: 0 })
    })
  }
);

// src/http/routes/update-menu.ts
import Elysia10, { t as t9 } from "elysia";
import { and as and2, eq as eq4, inArray } from "drizzle-orm";
var productSchema = t9.Object({
  id: t9.Optional(t9.String()),
  name: t9.String(),
  description: t9.Optional(t9.String()),
  price: t9.Number({ minimum: 0 })
});
var updateMenu = new Elysia10().use(authentication).put(
  "/menu",
  async ({ getManagedRestaurantId, set, body }) => {
    const restaurantId = await getManagedRestaurantId();
    const {
      products: { deletedProductIds, newOrUpdatedProducts }
    } = body;
    if (deletedProductIds.length > 0) {
      await db.delete(products).where(
        and2(
          inArray(products.id, deletedProductIds),
          eq4(products.restaurantId, restaurantId)
        )
      );
    }
    const updatedProducts = newOrUpdatedProducts.filter(
      (product) => {
        return !!product.id;
      }
    );
    if (updatedProducts.length > 0) {
      await Promise.all(
        updatedProducts.map((product) => {
          return db.update(products).set({
            name: product.name,
            description: product.description,
            priceInCents: product.price * 100
          }).where(
            and2(
              eq4(products.id, product.id),
              eq4(products.restaurantId, restaurantId)
            )
          );
        })
      );
    }
    const newProducts = newOrUpdatedProducts.filter(
      (product) => {
        return !product.id;
      }
    );
    if (newProducts.length) {
      await db.insert(products).values(
        newProducts.map((product) => {
          return {
            name: product.name,
            description: product.description,
            priceInCents: product.price * 100,
            restaurantId
          };
        })
      );
    }
    set.status = 204;
  },
  {
    body: t9.Object({
      products: t9.Object({
        newOrUpdatedProducts: t9.Array(productSchema),
        deletedProductIds: t9.Array(t9.String())
      })
    })
  }
);

// src/http/routes/update-profile.ts
import Elysia11, { t as t10 } from "elysia";
import { eq as eq5 } from "drizzle-orm";
var updateProfile = new Elysia11().use(authentication).put(
  "/profile",
  async ({ getManagedRestaurantId, set, body }) => {
    const restaurantId = await getManagedRestaurantId();
    const { name, description } = body;
    await db.update(restaurants).set({
      name,
      description
    }).where(eq5(restaurants.id, restaurantId));
    set.status = 204;
  },
  {
    body: t10.Object({
      name: t10.String(),
      description: t10.Optional(t10.String())
    })
  }
);

// src/http/routes/get-profile.ts
import Elysia12 from "elysia";
var getProfile = new Elysia12().use(authentication).get("/me", async ({ getCurrentUser }) => {
  const { sub: userId } = await getCurrentUser();
  const user = await db.query.users.findFirst({
    where(fields, { eq: eq15 }) {
      return eq15(fields.id, userId);
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
});

// src/http/routes/authenticate-from-link.ts
import Elysia13, { t as t11 } from "elysia";
import dayjs from "dayjs";
import { eq as eq6 } from "drizzle-orm";
var authenticateFromLink = new Elysia13().use(authentication).get(
  "/auth-links/authenticate",
  async ({ signUser, query, set }) => {
    const { code, redirect } = query;
    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq: eq15 }) {
        return eq15(fields.code, code);
      }
    });
    if (!authLinkFromCode) {
      throw new UnauthorizedError();
    }
    if (dayjs().diff(authLinkFromCode.createdAt, "days") > 7) {
      throw new UnauthorizedError();
    }
    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq: eq15 }) {
        return eq15(fields.managerId, authLinkFromCode.userId);
      }
    });
    await signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id
    });
    await db.delete(authLinks).where(eq6(authLinks.code, code));
    set.redirect = redirect;
  },
  {
    query: t11.Object({
      code: t11.String(),
      redirect: t11.String()
    })
  }
);

// src/http/routes/get-managed-restaurant.ts
import Elysia14 from "elysia";
var getManagedRestaurant = new Elysia14().use(authentication).get("/managed-restaurant", async ({ getManagedRestaurantId }) => {
  const restaurantId = await getManagedRestaurantId();
  const restaurant = await db.query.restaurants.findFirst({
    where(fields, { eq: eq15 }) {
      return eq15(fields.id, restaurantId);
    }
  });
  if (!restaurant) {
    throw new Error("Restaurant not found.");
  }
  return restaurant;
});

// src/http/routes/sign-out.ts
import Elysia15 from "elysia";
var signOut = new Elysia15().use(authentication).post("/sign-out", async ({ signOut: signOut2 }) => {
  signOut2();
});

// src/http/routes/get-order-details.ts
import Elysia16, { t as t12 } from "elysia";
var getOrderDetails = new Elysia16().use(authentication).get(
  "/orders/:id",
  async ({ getCurrentUser, params }) => {
    const { id: orderId } = params;
    const { restaurantId } = await getCurrentUser();
    if (!restaurantId) {
      throw new NotAManagerError();
    }
    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        createdAt: true,
        status: true,
        totalInCents: true
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true
          }
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true
          },
          with: {
            product: {
              columns: {
                name: true
              }
            }
          }
        }
      },
      where(fields, { eq: eq15, and: and9 }) {
        return and9(
          eq15(fields.id, orderId),
          eq15(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    return order;
  },
  {
    params: t12.Object({
      id: t12.String()
    })
  }
);

// src/http/routes/get-month-receipt.ts
import Elysia17 from "elysia";
import { and as and3, eq as eq7, gte, sql as sql2, sum } from "drizzle-orm";
import dayjs2 from "dayjs";
var getMonthReceipt = new Elysia17().use(authentication).get("/metrics/month-receipt", async ({ getManagedRestaurantId }) => {
  const restaurantId = await getManagedRestaurantId();
  const today = dayjs2();
  const lastMonth = today.subtract(1, "month");
  const startOfLastMonth = lastMonth.startOf("month");
  const lastMonthWithYear = lastMonth.format("YYYY-MM");
  const currentMonthWithYear = today.format("YYYY-MM");
  const monthsReceipts = await db.select({
    monthWithYear: sql2`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    receipt: sum(orders.totalInCents).mapWith(Number)
  }).from(orders).where(
    and3(
      eq7(orders.restaurantId, restaurantId),
      gte(orders.createdAt, startOfLastMonth.toDate())
    )
  ).groupBy(sql2`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`).having(({ receipt }) => gte(receipt, 1));
  const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
    return monthReceipt.monthWithYear === currentMonthWithYear;
  });
  const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
    return monthReceipt.monthWithYear === lastMonthWithYear;
  });
  const diffFromLastMonth = lastMonthReceipt && currentMonthReceipt ? currentMonthReceipt.receipt * 100 / lastMonthReceipt.receipt : null;
  return {
    receipt: currentMonthReceipt?.receipt ?? 0,
    diffFromLastMonth: diffFromLastMonth ? Number((diffFromLastMonth - 100).toFixed(2)) : 0
  };
});

// src/http/routes/get-month-orders-amount.ts
import Elysia18 from "elysia";
import { and as and4, count as count2, eq as eq8, gte as gte2, sql as sql3 } from "drizzle-orm";
import dayjs3 from "dayjs";
var getMonthOrdersAmount = new Elysia18().use(authentication).get("/metrics/month-orders-amount", async ({ getManagedRestaurantId }) => {
  const restaurantId = await getManagedRestaurantId();
  const today = dayjs3();
  const lastMonth = today.subtract(1, "month");
  const startOfLastMonth = lastMonth.startOf("month");
  const lastMonthWithYear = lastMonth.format("YYYY-MM");
  const currentMonthWithYear = today.format("YYYY-MM");
  const ordersPerMonth = await db.select({
    monthWithYear: sql3`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
    amount: count2(orders.id)
  }).from(orders).where(
    and4(
      eq8(orders.restaurantId, restaurantId),
      gte2(orders.createdAt, startOfLastMonth.toDate())
    )
  ).groupBy(sql3`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`).having(({ amount }) => gte2(amount, 1));
  const currentMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
    return ordersInMonth.monthWithYear === currentMonthWithYear;
  });
  const lastMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
    return ordersInMonth.monthWithYear === lastMonthWithYear;
  });
  const diffFromLastMonth = lastMonthOrdersAmount && currentMonthOrdersAmount ? currentMonthOrdersAmount.amount * 100 / lastMonthOrdersAmount.amount : null;
  return {
    amount: currentMonthOrdersAmount?.amount ?? 0,
    diffFromLastMonth: diffFromLastMonth ? Number((diffFromLastMonth - 100).toFixed(2)) : 0
  };
});

// src/http/routes/get-day-orders-amount.ts
import Elysia19 from "elysia";
import { and as and5, count as count3, eq as eq9, gte as gte3, sql as sql4 } from "drizzle-orm";
import dayjs4 from "dayjs";
var getDayOrdersAmount = new Elysia19().use(authentication).get("/metrics/day-orders-amount", async ({ getManagedRestaurantId }) => {
  const restaurantId = await getManagedRestaurantId();
  const today = dayjs4();
  const yesterday = today.subtract(1, "day");
  const startOfYesterday = yesterday.startOf("day");
  const yesterdayWithMonthAndYear = yesterday.format("YYYY-MM-DD");
  const todayWithMonthAndYear = today.format("YYYY-MM-DD");
  const ordersPerDay = await db.select({
    dayWithMonthAndYear: sql4`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
    amount: count3(orders.id)
  }).from(orders).where(
    and5(
      eq9(orders.restaurantId, restaurantId),
      gte3(orders.createdAt, startOfYesterday.toDate())
    )
  ).groupBy(sql4`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`).having(({ amount }) => gte3(amount, 1));
  const todayOrdersAmount = ordersPerDay.find((orderInDay) => {
    return orderInDay.dayWithMonthAndYear === todayWithMonthAndYear;
  });
  const yesterdayOrdersAmount = ordersPerDay.find((orderInDay) => {
    return orderInDay.dayWithMonthAndYear === yesterdayWithMonthAndYear;
  });
  const diffFromYesterday = yesterdayOrdersAmount && todayOrdersAmount ? todayOrdersAmount.amount * 100 / yesterdayOrdersAmount.amount : null;
  return {
    amount: todayOrdersAmount?.amount ?? 0,
    diffFromYesterday: diffFromYesterday ? Number((diffFromYesterday - 100).toFixed(2)) : 0
  };
});

// src/http/routes/get-month-canceled-orders-amount.ts
import Elysia20 from "elysia";
import { and as and6, count as count4, eq as eq10, gte as gte4, sql as sql5 } from "drizzle-orm";
import dayjs5 from "dayjs";
var getMonthCanceledOrdersAmount = new Elysia20().use(authentication).get(
  "/metrics/month-canceled-orders-amount",
  async ({ getManagedRestaurantId }) => {
    const restaurantId = await getManagedRestaurantId();
    const today = dayjs5();
    const lastMonth = today.subtract(1, "month");
    const startOfLastMonth = lastMonth.startOf("month");
    const lastMonthWithYear = lastMonth.format("YYYY-MM");
    const currentMonthWithYear = today.format("YYYY-MM");
    const ordersPerMonth = await db.select({
      monthWithYear: sql5`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
      amount: count4(orders.id)
    }).from(orders).where(
      and6(
        eq10(orders.restaurantId, restaurantId),
        eq10(orders.status, "canceled"),
        gte4(orders.createdAt, startOfLastMonth.toDate())
      )
    ).groupBy(sql5`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`).having(({ amount }) => gte4(amount, 1));
    const currentMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
      return ordersInMonth.monthWithYear === currentMonthWithYear;
    });
    const lastMonthOrdersAmount = ordersPerMonth.find((ordersInMonth) => {
      return ordersInMonth.monthWithYear === lastMonthWithYear;
    });
    const diffFromLastMonth = lastMonthOrdersAmount && currentMonthOrdersAmount ? currentMonthOrdersAmount.amount * 100 / lastMonthOrdersAmount.amount : null;
    return {
      amount: currentMonthOrdersAmount?.amount ?? 0,
      diffFromLastMonth: diffFromLastMonth ? Number((diffFromLastMonth - 100).toFixed(2)) : 0
    };
  }
);

// src/http/routes/get-daily-receipt-in-period.ts
import Elysia21, { t as t13 } from "elysia";
import { and as and7, eq as eq11, gte as gte5, lte, sql as sql6, sum as sum2 } from "drizzle-orm";
import dayjs6 from "dayjs";
var getDailyReceiptInPeriod = new Elysia21().use(authentication).get(
  "/metrics/daily-receipt-in-period",
  async ({ getManagedRestaurantId, query, set }) => {
    const restaurantId = await getManagedRestaurantId();
    const { from, to } = query;
    const startDate = from ? dayjs6(from) : dayjs6().subtract(7, "d");
    const endDate = to ? dayjs6(to) : from ? startDate.add(7, "days") : dayjs6();
    if (endDate.diff(startDate, "days") > 7) {
      set.status = 400;
      return {
        code: "INVALID_PERIOD",
        message: "O intervalo das datas n\xE3o pode ser superior a 7 dias."
      };
    }
    const receiptPerDay = await db.select({
      date: sql6`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
      receipt: sum2(orders.totalInCents).mapWith(Number)
    }).from(orders).where(
      and7(
        eq11(orders.restaurantId, restaurantId),
        gte5(
          orders.createdAt,
          startDate.startOf("day").add(startDate.utcOffset(), "minutes").toDate()
        ),
        lte(
          orders.createdAt,
          endDate.endOf("day").add(endDate.utcOffset(), "minutes").toDate()
        )
      )
    ).groupBy(sql6`TO_CHAR(${orders.createdAt}, 'DD/MM')`).having(({ receipt }) => gte5(receipt, 1));
    const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
      const [dayA, monthA] = a.date.split("/").map(Number);
      const [dayB, monthB] = b.date.split("/").map(Number);
      if (monthA === monthB) {
        return dayA - dayB;
      } else {
        const dateA = new Date(2023, monthA - 1);
        const dateB = new Date(2023, monthB - 1);
        return dateA.getTime() - dateB.getTime();
      }
    });
    return orderedReceiptPerDay;
  },
  {
    query: t13.Object({
      from: t13.Optional(t13.String()),
      to: t13.Optional(t13.String())
    })
  }
);

// src/http/routes/get-popular-products.ts
import Elysia22 from "elysia";
import { and as and8, count as count6, eq as eq12 } from "drizzle-orm";
var getPopularProducts = new Elysia22().use(authentication).get("/metrics/popular-products", async ({ getManagedRestaurantId }) => {
  const restaurantId = await getManagedRestaurantId();
  try {
    const popularProducts = await db.select({
      product: products.name,
      amount: count6(orderItems.id)
    }).from(orderItems).leftJoin(orders, eq12(orders.id, orderItems.orderId)).leftJoin(products, eq12(products.id, orderItems.productId)).where(and8(eq12(orders.restaurantId, restaurantId))).groupBy(products.name).limit(5);
    return popularProducts;
  } catch (err) {
    console.log(err);
  }
});

// src/http/routes/dispatch-order.ts
import Elysia23, { t as t14 } from "elysia";
import { eq as eq13 } from "drizzle-orm";
var dispatchOrder = new Elysia23().use(authentication).patch(
  "/orders/:id/dispatch",
  async ({ getManagedRestaurantId, set, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId();
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq15, and: and9 }) {
        return and9(
          eq15(fields.id, orderId),
          eq15(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    if (order.status !== "processing") {
      set.status = 400;
      return { message: "O pedido j\xE1 foi enviado ao cliente." };
    }
    await db.update(orders).set({
      status: "delivering"
    }).where(eq13(orders.id, orderId));
    set.status = 204;
  },
  {
    params: t14.Object({
      id: t14.String()
    })
  }
);

// src/http/routes/deliver-order.ts
import Elysia24, { t as t15 } from "elysia";
import { eq as eq14 } from "drizzle-orm";
var deliverOrder = new Elysia24().use(authentication).patch(
  "/orders/:id/deliver",
  async ({ getManagedRestaurantId, set, params }) => {
    const { id: orderId } = params;
    const restaurantId = await getManagedRestaurantId();
    const order = await db.query.orders.findFirst({
      where(fields, { eq: eq15, and: and9 }) {
        return and9(
          eq15(fields.id, orderId),
          eq15(fields.restaurantId, restaurantId)
        );
      }
    });
    if (!order) {
      throw new UnauthorizedError();
    }
    if (order.status !== "delivering") {
      set.status = 400;
      return { message: "O pedido j\xE1 foi entregue." };
    }
    await db.update(orders).set({
      status: "delivered"
    }).where(eq14(orders.id, orderId));
    set.status = 204;
  },
  {
    params: t15.Object({
      id: t15.String()
    })
  }
);

// src/http/server.ts
var app = new Elysia25().use(
  cors({
    credentials: true,
    allowedHeaders: ["content-type"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    origin: (request) => {
      const origin = request.headers.get("origin");
      if (!origin) {
        return false;
      }
      return true;
    }
  })
).use(authentication).use(signOut).use(getProfile).use(getManagedRestaurant).use(registerRestaurant).use(registerCustomer).use(sendAuthenticationLink).use(authenticateFromLink).use(createOrder).use(approveOrder).use(cancelOrder).use(dispatchOrder).use(deliverOrder).use(getOrders).use(getOrderDetails).use(createEvaluation).use(getEvaluations).use(updateMenu).use(updateProfile).use(getMonthReceipt).use(getMonthOrdersAmount).use(getDayOrdersAmount).use(getMonthCanceledOrdersAmount).use(getDailyReceiptInPeriod).use(getPopularProducts).onError(({ code, error, set }) => {
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
app.listen(3333);
console.log(
  `\u{1F525} HTTP server running at ${app.server?.hostname}:${app.server?.port}`
);
