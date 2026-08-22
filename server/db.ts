import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { InsertUser, User, users, generations, templates, subscriptions, usage, subscriberWaitlist, Generation, Template } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date(); updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return rows[0]; }
export async function getTemplates(activeOnly = true) { const db = await getDb(); if (!db) return []; return db.select().from(templates).where(activeOnly ? eq(templates.isActive, true) : undefined).orderBy(templates.id); }
export async function getTemplateById(id: number) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(templates).where(eq(templates.id, id)).limit(1); return rows[0]; }
export async function deleteTemplate(id: number) { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); await db.delete(templates).where(eq(templates.id, id)); }
function nonEmpty(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function storageKeyPath(value: string | null | undefined) {
  const raw = nonEmpty(value);
  if (!raw) return undefined;
  let path = raw;
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    return undefined;
  }
  path = path.replace(/^\/+/, "").replace(/^manus-storage\//, "");
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep the original path when it is not encoded.
  }
  return `/manus-storage/${path.split("/").filter(Boolean).map(encodeURIComponent).join("/")}`;
}

export function normalizeGenerationMedia(row: Generation) {
  const originalImageUrl = storageKeyPath(row.originalImageKey) ?? nonEmpty(row.originalImageUrl);
  const generatedImageUrl = storageKeyPath(row.generatedImageKey) ?? nonEmpty(row.generatedImageUrl);
  return { ...row, originalImageUrl, generatedImageUrl };
}
export async function getUserGenerations(userId: number) { const db = await getDb(); if (!db) return []; const rows = await db.select().from(generations).where(eq(generations.userId, userId)).orderBy(desc(generations.createdAt)); return rows.map(normalizeGenerationMedia); }
export async function getGenerationById(id: number, userId: number) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(generations).where(and(eq(generations.id, id), eq(generations.userId, userId))).limit(1); return rows[0]; }
export async function getActiveSubscription(userId: number) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(subscriptions).where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"))).orderBy(desc(subscriptions.createdAt)).limit(1); return rows[0]; }
export async function getUsage(userId: number, month: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(usage).where(and(eq(usage.userId, userId), eq(usage.month, month))).limit(1); return rows[0]; }
export async function ensureUsage(userId: number, month: string, limit: number) { const db = await getDb(); if (!db) return undefined; const existing = await getUsage(userId, month); if (existing?.resetAt && existing.resetAt.getTime() <= Date.now() && existing.generationsUsed >= existing.generationLimit) { await db.update(usage).set({ generationsUsed: 0, generationLimit: limit, resetAt: null }).where(and(eq(usage.userId, userId), eq(usage.month, month))); } else { await db.insert(usage).values({ userId, month, generationLimit: limit }).onDuplicateKeyUpdate({ set: { generationLimit: limit } }); } return getUsage(userId, month); }
export async function createGeneration(input: typeof generations.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); const result = await db.insert(generations).values(input); return Number(result[0].insertId); }
export async function updateGeneration(id: number, values: Partial<typeof generations.$inferInsert>) { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); await db.update(generations).set(values).where(eq(generations.id, id)); }
export function canConsumeCredit(generationsUsed: number, generationLimit: number) { return generationsUsed < generationLimit; }
export async function consumeCreditAtomic(userId: number, month: string) { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); const updated = await db.update(usage).set({ generationsUsed: sql`${usage.generationsUsed} + 1`, resetAt: sql`IF(${usage.generationsUsed} + 1 >= ${usage.generationLimit}, DATE_ADD(NOW(), INTERVAL 24 HOUR), ${usage.resetAt})` }).where(and(eq(usage.userId, userId), eq(usage.month, month), sql`${usage.generationsUsed} < ${usage.generationLimit}`)); return updated[0].affectedRows === 1; }
export async function joinSubscriberWaitlist(input: { userId: number; name: string; email: string; plan: "STARTER" | "BUSINESS" }) { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); await db.insert(subscriberWaitlist).values(input); return { success: true as const }; }
export async function getAdminStats() { const db = await getDb(); if (!db) return { users: 0, generations: 0, completed: 0, failed: 0, free: 0, starter: 0, business: 0 }; const [u, g, c, f, free, starter, business] = await Promise.all([db.select({ count: sql<number>`count(*)` }).from(users), db.select({ count: sql<number>`count(*)` }).from(generations), db.select({ count: sql<number>`count(*)` }).from(generations).where(eq(generations.status, "completed")), db.select({ count: sql<number>`count(*)` }).from(generations).where(eq(generations.status, "failed")), db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.plan, "FREE")), db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.plan, "STARTER")), db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.plan, "BUSINESS"))]); return { users: Number(u[0]?.count ?? 0), generations: Number(g[0]?.count ?? 0), completed: Number(c[0]?.count ?? 0), failed: Number(f[0]?.count ?? 0), free: Number(free[0]?.count ?? 0), starter: Number(starter[0]?.count ?? 0), business: Number(business[0]?.count ?? 0) }; }
