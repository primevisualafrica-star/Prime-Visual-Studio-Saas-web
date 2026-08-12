import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index, uniqueIndex } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["FREE", "STARTER", "BUSINESS"]).default("FREE").notNull(),
  status: mysqlEnum("status", ["active", "canceled", "expired"]).default("active").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ userIdx: index("subscriptions_user_idx").on(table.userId) }));

export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  scene: varchar("scene", { length: 64 }).notNull(),
  icon: varchar("icon", { length: 12 }).notNull(),
  description: text("description").notNull(),
  promptTemplate: text("promptTemplate").notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ activeIdx: index("templates_active_idx").on(table.isActive) }));

export const generations = mysqlTable("generations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  originalImageUrl: text("originalImageUrl").notNull(),
  originalImageKey: text("originalImageKey").notNull(),
  generatedImageUrl: text("generatedImageUrl"),
  generatedImageKey: text("generatedImageKey"),
  category: varchar("category", { length: 64 }).notNull(),
  scene: varchar("scene", { length: 64 }).notNull(),
  templateId: int("templateId"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  creditsUsed: int("creditsUsed").default(0).notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ userIdx: index("generations_user_idx").on(table.userId), statusIdx: index("generations_status_idx").on(table.status) }));

export const usage = mysqlTable("usage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  month: varchar("month", { length: 7 }).notNull(),
  generationsUsed: int("generationsUsed").default(0).notNull(),
  generationLimit: int("generationLimit").default(5).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ userMonthUnique: uniqueIndex("usage_user_month_unique").on(table.userId, table.month) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type Generation = typeof generations.$inferSelect;
export type Usage = typeof usage.$inferSelect;
