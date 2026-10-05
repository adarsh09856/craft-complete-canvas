import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
};

/** Live Supabase session for client components. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
      setLoading(false);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

/** True when the signed-in account has an admin/staff role. */
export function useStaff(user: User | null) {
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsStaff(false);
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    let alive = true;
    setChecking(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(async ({ data }) => {
        if (!alive) return;
        let roles = (data ?? []).map((row) => row.role as string);

        // If user has no role, check if this is the very first registered user of the agency
        if (roles.length === 0) {
          const { count } = await supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
          if (count === 0 || count === null) {
            await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
            roles = ["admin"];
          }
        }

        setIsAdmin(roles.includes("admin"));
        setIsStaff(roles.includes("admin") || roles.includes("staff"));
        setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  return { isStaff, isAdmin, checking };
}

export const getProfile = async (id: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as Profile | null;
};

export const saveProfile = async (id: string, patch: Partial<Profile>) => {
  const { error } = await supabase.from("profiles").upsert({ id, ...patch }, { onConflict: "id" });
  if (error) throw new Error(error.message);
};

export const signOutEverywhere = async () => {
  await supabase.auth.signOut();
};
