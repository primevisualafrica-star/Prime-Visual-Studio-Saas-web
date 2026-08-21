import express, { type Request, type Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";

let app: express.Express | undefined;

function createVercelApp() {
  const instance = express();
  instance.use(express.json({ limit: "50mb" }));
  instance.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Vercel rewrites `/manus-storage/*` to this catch-all function under
  // `/api/manus-storage/*`. Normalize that internal path before mounting the
  // same storage proxy used by the managed server.
  instance.use((req, _res, next) => {
    if (req.url.startsWith("/api/manus-storage/")) {
      req.url = req.url.replace(/^\/api/, "");
    }
    next();
  });

  registerStorageProxy(instance);
  registerOAuthRoutes(instance);
  instance.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  return instance;
}

export default function handler(req: Request, res: Response) {
  app ??= createVercelApp();
  return app(req, res);
}
