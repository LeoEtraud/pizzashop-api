import {
  env
} from "./chunk-2V7TP353.js";
import {
  __export
} from "./chunk-MLKGABMK.js";

// src/db/connection.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// src/db/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  authLinks: () => authLinks,
  evaluations: () => evaluations,
  evaluationsRelations: () => evaluationsRelations,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orderStatusEnum: () => orderStatusEnum,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  restaurants: () => restaurants,
  restaurantsRelations: () => restaurantsRelations,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});

// src/db/schema/users.ts
import { createId as createId3 } from "@paralleldrive/cuid2";
import { relations as relations3 } from "drizzle-orm";
import { pgEnum as pgEnum2, pgTable as pgTable3, text as text3, timestamp as timestamp2 } from "drizzle-orm/pg-core";

// src/db/schema/orders.ts
import { createId as createId2 } from "@paralleldrive/cuid2";
import { integer as integer2, pgEnum, pgTable as pgTable2, text as text2, timestamp } from "drizzle-orm/pg-core";
import { relations as relations2 } from "drizzle-orm";

// src/db/schema/order-items.ts
import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
var orderItems = pgTable("order_items", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, {
    onDelete: "cascade"
  }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null"
  }),
  quantity: integer("quantity").default(1),
  priceInCents: integer("price_in_cents").notNull()
});
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

// src/db/schema/orders.ts
var orderStatusEnum = pgEnum("order_status", [
  "pending",
  "canceled",
  "processing",
  "delivering",
  "delivered"
]);
var orders = pgTable2("orders", {
  id: text2("id").$defaultFn(() => createId2()).primaryKey(),
  customerId: text2("customer_id").references(() => users.id, {
    onDelete: "set null"
  }).notNull(),
  restaurantId: text2("restaurant_id").references(() => restaurants.id, {
    onDelete: "set null"
  }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalInCents: integer2("total_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var ordersRelations = relations2(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id]
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id]
  }),
  orderItems: many(orderItems)
}));

// src/db/schema/users.ts
var userRoleEnum = pgEnum2("user_role", ["manager", "customer"]);
var users = pgTable3("users", {
  id: text3("id").$defaultFn(() => createId3()).primaryKey(),
  name: text3("name").notNull(),
  email: text3("email").notNull().unique(),
  phone: text3("phone"),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at").defaultNow()
});
var usersRelations = relations3(users, ({ many }) => ({
  orders: many(orders)
}));

// src/db/schema/restaurants.ts
import { createId as createId4 } from "@paralleldrive/cuid2";
import { pgTable as pgTable4, text as text4, timestamp as timestamp3 } from "drizzle-orm/pg-core";
import { relations as relations4 } from "drizzle-orm";
var restaurants = pgTable4("restaurants", {
  id: text4("id").$defaultFn(() => createId4()).primaryKey(),
  name: text4("name").notNull(),
  description: text4("description"),
  managerId: text4("manager_id").references(() => users.id, {
    onDelete: "set null"
  }),
  createdAt: timestamp3("created_at").defaultNow(),
  updatedAt: timestamp3("updated_at").defaultNow()
});
var restaurantsRelations = relations4(restaurants, ({ one, many }) => ({
  manager: one(users, {
    fields: [restaurants.managerId],
    references: [users.id],
    relationName: "restaurantManager"
  }),
  orders: many(orders),
  products: many(products)
}));

// src/db/schema/evaluations.ts
import { createId as createId5 } from "@paralleldrive/cuid2";
import { relations as relations5 } from "drizzle-orm";
import { pgTable as pgTable5, integer as integer3, text as text5, timestamp as timestamp4 } from "drizzle-orm/pg-core";
var evaluations = pgTable5("evaluations", {
  id: text5("id").$defaultFn(() => createId5()).primaryKey(),
  customerId: text5("customer_id").references(() => users.id),
  restaurantId: text5("restaurant_id").references(() => users.id),
  rate: integer3("rate").notNull(),
  comment: text5("comment"),
  createdAt: timestamp4("created_at").defaultNow()
});
var evaluationsRelations = relations5(evaluations, ({ one }) => ({
  customer: one(users, {
    fields: [evaluations.customerId],
    references: [users.id]
  }),
  restaurant: one(restaurants, {
    fields: [evaluations.restaurantId],
    references: [restaurants.id]
  })
}));

// src/db/schema/auth-links.ts
import { createId as createId6 } from "@paralleldrive/cuid2";
import { pgTable as pgTable6, text as text6, timestamp as timestamp5, index } from "drizzle-orm/pg-core";
var authLinks = pgTable6(
  "auth_links",
  {
    id: text6("id").$defaultFn(() => createId6()).primaryKey(),
    code: text6("code").notNull().unique(),
    userId: text6("user_id").references(() => users.id).notNull(),
    createdAt: timestamp5("created_at", { withTimezone: true }).defaultNow().notNull(),
    // NEW
    expiresAt: timestamp5("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp5("used_at", { withTimezone: true })
  },
  (t) => ({
    byUserCreated: index("auth_links_user_created_idx").on(
      t.userId,
      t.createdAt
    )
  })
);

// src/db/schema/products.ts
import { createId as createId7 } from "@paralleldrive/cuid2";
import { integer as integer4, pgTable as pgTable7, text as text7, timestamp as timestamp6 } from "drizzle-orm/pg-core";
import { relations as relations6 } from "drizzle-orm";
var products = pgTable7("products", {
  id: text7("id").$defaultFn(() => createId7()).primaryKey(),
  name: text7("name").notNull(),
  description: text7("description"),
  priceInCents: integer4("price_in_cents").notNull(),
  restaurantId: text7("restaurant_id").references(() => restaurants.id, {
    onDelete: "cascade"
  }).notNull(),
  createdAt: timestamp6("created_at").defaultNow(),
  updatedAt: timestamp6("updated_at").defaultNow()
});
var productsRelations = relations6(products, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [products.restaurantId],
    references: [restaurants.id],
    relationName: "productRestaurant"
  }),
  orderItems: many(orderItems)
}));

// src/db/connection.ts
var client = postgres(env.DB_URL);
var db = drizzle(client, { schema: schema_exports });

export {
  orderItems,
  orders,
  users,
  restaurants,
  evaluations,
  authLinks,
  products,
  db
};
