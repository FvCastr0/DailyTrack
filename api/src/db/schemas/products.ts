import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  sku: text("sku").unique().notNull(),
  weight: decimal("weight").notNull(), // kg
  length: integer("length").notNull(), // cm
  width: integer("width").notNull(), // cm
  height: integer("height").notNull(), // cm
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
