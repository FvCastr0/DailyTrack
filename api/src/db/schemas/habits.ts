import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const logStatusEnum = pgEnum("log_status", ["COMPLETED", "SKIPPED"]);

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  title: text("title").notNull(),
  description: text("description"),

  weekDays: integer("week_days").array().notNull(),

  // === METAS QUANTITATIVAS ===
  // Se null, é apenas check (sim/não). Se tiver valor, é numérico (ex: 2000ml)
  goalValue: integer("goal_value"),
  goalUnit: text("goal_unit"), // Ex: "ml", "páginas", "minutos"

  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const habitLogs = pgTable("habit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .references(() => habits.id, { onDelete: "cascade" })
    .notNull(),

  // === VALIDANDO A DATA ===
  // Armazena YYYY-MM-DD para garantir unicidade diária fácil
  date: date("date").notNull(),

  // === ELASTICIDADE (Vidas) ===
  status: logStatusEnum("status").default("COMPLETED").notNull(),

  // === MICRO-JOURNALING ===
  observation: text("observation"), // "Estava cansado, mas fiz mesmo assim"

  // Valor realizado (ex: leu 5 páginas de 10)
  value: integer("value"),

  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const habitStats = pgTable("habit_stats", {
  habitId: uuid("habit_id").primaryKey(),
  currentStreak: integer("current_streak").default(0),
  bestStreak: integer("best_streak").default(0)
});
