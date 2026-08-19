const ERROR_REPORTING_ENDPOINT = import.meta.env.VITE_ERROR_REPORTING_ENDPOINT as string | undefined;

interface FrontendErrorPayload {
  message: string;
  name: string;
  stack?: string;
  source: "error-boundary" | "window-error" | "unhandled-rejection";
  path: string;
  userAgent: string;
  timestamp: string;
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error("Unknown frontend error");
  }
}

function sanitizeStack(stack?: string) {
  if (!stack) return undefined;
  return stack.replace(/https?:\/\/[^\s)]+/g, "[url]").slice(0, 4000);
}

export function reportFrontendError(value: unknown, source: FrontendErrorPayload["source"]) {
  if (typeof window === "undefined") return;

  const error = toError(value);
  const payload: FrontendErrorPayload = {
    message: error.message.slice(0, 1000),
    name: error.name.slice(0, 200),
    stack: sanitizeStack(error.stack),
    source,
    path: window.location.pathname,
    userAgent: window.navigator.userAgent.slice(0, 300),
    timestamp: new Date().toISOString(),
  };

  console.error("[Frontend Error]", payload);

  if (!ERROR_REPORTING_ENDPOINT) return;

  const body = JSON.stringify(payload);
  try {
    if (typeof navigator.sendBeacon === "function") {
      const accepted = navigator.sendBeacon(
        ERROR_REPORTING_ENDPOINT,
        new Blob([body], { type: "application/json" })
      );
      if (accepted) return;
    }

    void fetch(ERROR_REPORTING_ENDPOINT, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Error reporting must never interfere with the application.
  }
}

export function installGlobalErrorMonitoring() {
  if (typeof window === "undefined") return () => undefined;

  const onError = (event: ErrorEvent) => {
    reportFrontendError(event.error ?? event.message, "window-error");
  };
  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    reportFrontendError(event.reason, "unhandled-rejection");
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}
