import express, { type Request, type Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { applyCorsHeaders } from "./_core/cors";

let app: express.Express | undefined;
let trpcApp: express.Express | undefined;
let storageApp: express.Express | undefined;

function createJsonApp() {
  const instance = express();
  instance.use((req, res, next) => {
    applyCorsHeaders(req, res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });
  instance.use(express.json({ limit: "50mb" }));
  instance.use(express.urlencoded({ limit: "50mb", extended: true }));
  return instance;
}

function createTrpcApp() {
  const instance = createJsonApp();
  registerOAuthRoutes(instance);
  const trpcMiddleware = createExpressMiddleware({
    router: appRouter,
    createContext,
  });

  instance.use((req, _res, next) => {
    if (req.url.startsWith("/api/trpc/")) {
      req.url = req.url.replace(/^\/api/, "");
    }
    next();
  });
  instance.use("/trpc", trpcMiddleware);
  instance.use("/api/trpc", trpcMiddleware);
  instance.use("/", trpcMiddleware);
  return instance;
}

function createStorageApp() {
  const instance = createJsonApp();
  instance.use((req, _res, next) => {
    if (req.url.startsWith("/api/manus-storage/")) {
      req.url = req.url.replace(/^\/api/, "");
    }
    if (!req.url.startsWith("/manus-storage/")) {
      req.url = `/manus-storage${req.url.startsWith("/") ? req.url : `/${req.url}`}`;
    }
    next();
  });
  registerStorageProxy(instance);
  return instance;
}

function createVercelApp() {
  const instance = createJsonApp();
  registerStorageProxy(instance);
  registerOAuthRoutes(instance);
  const trpcMiddleware = createExpressMiddleware({
    router: appRouter,
    createContext,
  });

  instance.use((req, _res, next) => {
    if (req.url.startsWith("/api/manus-storage/")) {
      req.url = req.url.replace(/^\/api/, "");
    }
    if (req.url.startsWith("/api/trpc/")) {
      req.url = req.url.replace(/^\/api/, "");
    }
    next();
  });

  instance.use("/trpc", trpcMiddleware);
  instance.use("/api/trpc", trpcMiddleware);
  return instance;
}

export function vercelHandler(req: Request, res: Response) {
  app ??= createVercelApp();
  return app(req, res);
}

export function vercelTrpcHandler(req: Request, res: Response) {
  trpcApp ??= createTrpcApp();
  return trpcApp(req, res);
}

export function vercelStorageHandler(req: Request, res: Response) {
  storageApp ??= createStorageApp();
  return storageApp(req, res);
}
