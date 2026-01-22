import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./user";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  status: text("status").default("pending"), // pending, paid, shipped, delivered
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
  shippingService: text("shipping_service"), // Ex: "Sedex", "Jadlog"
  trackingCode: text("tracking_code"),
  createdAt: timestamp("created_at").defaultNow()
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),

  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp("created_at").defaultNow()
});
