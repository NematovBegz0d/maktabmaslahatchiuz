import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "admin";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await fetchRole(s.user.id);
      } else {
        setLoading(false);
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await fetchRole(s.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    init();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function fetchRole(uid: string) {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("[useAuth] user_roles error:", error.message);
      }
      console.log("[useAuth] uid:", uid, "role row:", data);
      setRole((data?.role as AppRole) ?? "student");
    } catch (e) {
      console.error("[useAuth] fetchRole exception:", e);
      setRole("student");
    } finally {
      setLoading(false);
    }
  }

  return { session, user, role, loading };
}
