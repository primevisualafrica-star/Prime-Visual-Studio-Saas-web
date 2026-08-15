import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storageAssertReadable, storagePut } from "./storage";
import { createGeneration, consumeCreditAtomic, ensureUsage, getActiveSubscription, getAdminStats, getGenerationById, getTemplates, getTemplateById, deleteTemplate, getUsage, getUserGenerations, updateGeneration } from "./db";
import { imageGenerationService, buildProductPrompt } from "./services/imageGenerationService";
import { getDb } from "./db";
import { getSupabaseActiveSubscription } from "./supabase";
import { templates } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";

const PLAN_LIMITS = { FREE: 5, STARTER: 50, BUSINESS: 200 } as const;
type Plan = keyof typeof PLAN_LIMITS;

async function getEffectiveSubscription(user: NonNullable<Parameters<typeof getActiveSubscription>[0]> extends never ? never : any, accessToken: string | null) {
  if (accessToken && user.loginMethod === "supabase") {
    const remote = await getSupabaseActiveSubscription(user.openId, accessToken);
    if (remote?.plan === "FREE" || remote?.plan === "STARTER" || remote?.plan === "BUSINESS") {
      return { ...remote, plan: remote.plan as Plan };
    }
    return undefined;
  }
  return getActiveSubscription(user.id);
}

const uploadSchema = z.object({ fileName: z.string().min(1), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), data: z.string().min(1) });
const monthKey = () => new Date().toISOString().slice(0, 7);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
  }),
  templates: router({
    list: publicProcedure.query(() => getTemplates(true)),
    adminList: adminProcedure.query(() => getTemplates(false)),
    create: adminProcedure.input(z.object({ name: z.string(), category: z.string(), scene: z.string(), icon: z.string(), description: z.string(), promptTemplate: z.string(), isPremium: z.boolean().default(false) })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); await db.insert(templates).values(input); return { success: true }; }),
    update: adminProcedure.input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), promptTemplate: z.string().optional(), isPremium: z.boolean().optional(), isActive: z.boolean().optional() })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new Error("Base de données indisponible"); const { id, ...values } = input; await db.update(templates).set(values).where(eq(templates.id, id)); return { success: true }; }),
    remove: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await deleteTemplate(input.id); return { success: true }; }),
  }),
  usage: router({
    current: protectedProcedure.query(async ({ ctx }) => { const subscription = await getEffectiveSubscription(ctx.user, ctx.supabaseAccessToken); const plan = (subscription?.plan ?? "FREE") as Plan; const limit = PLAN_LIMITS[plan]; const month = monthKey(); const row = await ensureUsage(ctx.user.id, month, limit); return { used: row?.generationsUsed ?? 0, limit, plan }; }),
  }),
  generations: router({
    list: protectedProcedure.query(({ ctx }) => getUserGenerations(ctx.user.id)),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => getGenerationById(input.id, ctx.user.id)),
    upload: protectedProcedure.input(uploadSchema).mutation(async ({ ctx, input }) => { const bytes = Buffer.from(input.data.split(",").pop() ?? "", "base64"); if (bytes.length > 10 * 1024 * 1024) throw new Error("Le fichier dépasse la limite de 10 Mo."); const { key, url } = await storagePut(`users/${ctx.user.id}/originals/${Date.now()}-${input.fileName}`, bytes, input.mimeType); await storageAssertReadable(key); const id = await createGeneration({ userId: ctx.user.id, originalImageUrl: url, originalImageKey: key, category: "", scene: "", status: "pending", creditsUsed: 0 }); return { id, url }; }),
    generate: protectedProcedure.input(z.object({ id: z.number(), category: z.string(), scene: z.string(), templateId: z.number().optional(), mimeType: z.string().default("image/jpeg") })).mutation(async ({ ctx, input }) => { const generation = await getGenerationById(input.id, ctx.user.id); if (!generation) throw new Error("Génération introuvable."); const subscription = await getEffectiveSubscription(ctx.user, ctx.supabaseAccessToken); const plan = (subscription?.plan ?? "FREE") as Plan; const month = monthKey(); const row = await ensureUsage(ctx.user.id, month, PLAN_LIMITS[plan]); if (!row || row.generationsUsed >= row.generationLimit) throw new Error("Vous avez utilisé tous vos crédits. Passez à un plan supérieur pour continuer."); await updateGeneration(input.id, { category: input.category, scene: input.scene, templateId: input.templateId, status: "processing" }); try { const template = input.templateId ? await getTemplateById(input.templateId) : undefined; const prompt = buildProductPrompt(input.category, input.scene, template?.promptTemplate ?? "Créer un visuel publicitaire premium et réaliste."); const requestProtoHeader = ctx.req.headers["x-forwarded-proto"]; const requestProtocol = (Array.isArray(requestProtoHeader) ? requestProtoHeader[0] : requestProtoHeader?.split(",")[0])?.trim() || ctx.req.protocol || "https"; const requestOrigin = `${requestProtocol}://${ctx.req.get("host")}`; const originalImageUrl = generation.originalImageKey ? new URL(`/manus-storage/${generation.originalImageKey}`, requestOrigin).toString() : generation.originalImageUrl; const result = await imageGenerationService.generateVisual({ prompt, originalImageUrl, mimeType: input.mimeType }); const generatedResponse = await fetch(result.signedUrl); if (!generatedResponse.ok) throw new Error(`Impossible de lire l'image générée (${generatedResponse.status}).`); const generatedBytes = Buffer.from(await generatedResponse.arrayBuffer()); const stamp = Date.now(); const originalBytes = await sharp(generatedBytes).png().toBuffer(); const portraitBytes = await sharp(generatedBytes).resize({ width: 800, height: 1000, fit: "contain", background: "#f7f4fd" }).png().toBuffer(); const storyBytes = await sharp(generatedBytes).resize({ width: 900, height: 1600, fit: "contain", background: "#f7f4fd" }).png().toBuffer(); const stored = await storagePut(`users/${ctx.user.id}/generated/${input.id}-${stamp}-original.png`, originalBytes, "image/png"); const portrait = await storagePut(`users/${ctx.user.id}/generated/${input.id}-${stamp}-4x5.png`, portraitBytes, "image/png"); const story = await storagePut(`users/${ctx.user.id}/generated/${input.id}-${stamp}-9x16.png`, storyBytes, "image/png"); const consumed = await consumeCreditAtomic(ctx.user.id, month); if (!consumed) throw new Error("Crédit indisponible."); await updateGeneration(input.id, { generatedImageUrl: stored.url, generatedImageKey: stored.key, status: "completed", creditsUsed: 1 }); return { success: true, imageUrl: stored.url, formats: { original: stored.url, portrait: portrait.url, story: story.url } }; } catch (error) { await updateGeneration(input.id, { status: "failed", errorMessage: error instanceof Error ? error.message : "Erreur inconnue" }); throw new Error("La génération n'a pas abouti. Aucun crédit n'a été consommé. Veuillez réessayer."); } }),
  }),
  subscription: router({ plans: publicProcedure.query(() => [{ name: "FREE", price: "0 FCFA", credits: "5 générations / mois", note: "Avec filigrane" }, { name: "STARTER", price: "3 000 FCFA", credits: "50 générations / mois", note: "Sans filigrane" }, { name: "BUSINESS", price: "15 000 FCFA", credits: "200 générations / mois", note: "Templates premium · Usage commercial" }]), current: protectedProcedure.query(({ ctx }) => getEffectiveSubscription(ctx.user, ctx.supabaseAccessToken)) }),
  admin: router({ stats: adminProcedure.query(() => getAdminStats()) }),
});
export type AppRouter = typeof appRouter;
