import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from ".";

export const authLinks = pgTable(
  "auth_links",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    code: text("code").notNull().unique(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    // NEW
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
  },
  (t) => ({
    byUserCreated: index("auth_links_user_created_idx").on(
      t.userId,
      t.createdAt
    ),
  })
);
