import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

function getSupabaseFallbackUser(session: Session | null) {
  const authUser = session?.user;
  if (!authUser) return null;

  const metadata = authUser.user_metadata ?? {};
  const name = metadata.full_name ?? metadata.name ?? authUser.email?.split("@")[0] ?? "Mon profil";
  const now = new Date();

  return {
    id: 0,
    openId: authUser.id,
    name,
    email: authUser.email ?? null,
    loginMethod: "supabase",
    role: "user" as const,
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [supabaseSessionReady, setSupabaseSessionReady] = useState(!supabase);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  useEffect(() => {
    if (!supabase) {
      setSupabaseSessionReady(true);
      return;
    }

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSupabaseSession(data.session);
      setSupabaseSessionReady(true);
      void utils.auth.me.invalidate();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseSession(session);
      setSupabaseSessionReady(true);
      void utils.auth.me.invalidate();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [utils]);

  const logout = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      try {
        sessionStorage.removeItem("manus-cookie");
      } catch {}
      setSupabaseSession(null);
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    const user = meQuery.data ?? getSupabaseFallbackUser(supabaseSession);
    localStorage.setItem("manus-runtime-user-info", JSON.stringify(user));
    return {
      user,
      loading: !supabaseSessionReady || meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(user),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    supabaseSession,
    supabaseSessionReady,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (state.loading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      window.location.href = "/";
    }
  }, [redirectOnUnauthenticated, redirectPath, state.loading, state.user]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
