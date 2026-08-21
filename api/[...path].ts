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
  const trpcMiddleware = createExpressMiddleware({
    router: appRouter,
    createContext,
  });

  // Depending on Vercel's function path normalization, the catch-all handler
  // receives either `/api/trpc/*` or `/trpc/*`. Support both forms so the
  // public Vercel deployment cannot fall through to an HTML/404 response.
  instance.use("/api/trpc", trpcMiddleware);
  instance.use("/trpc", trpcMiddleware);

  return instance;
}

export default function handler(req: Request, res: Response) {
  app ??= createVercelApp();
  return app(req, res);
}
