import express, { type Request, type Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";

let app: express.Express | undefined;

function createVercelApp() {
  const instance = express();
  instance.use(express.json({ limit: "50mb" }));
  instance.use(express.urlencoded({ limit: "50mb", extended: true }));

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

  // Vercel may pass the function-relative path (`/trpc/...`) or the full
  // rewritten path (`/api/trpc/...`). Support both forms.
  instance.use("/api/trpc", trpcMiddleware);
  instance.use("/trpc", trpcMiddleware);

  return instance;
}

export function vercelHandler(req: Request, res: Response) {
  app ??= createVercelApp();
  return app(req, res);
}
