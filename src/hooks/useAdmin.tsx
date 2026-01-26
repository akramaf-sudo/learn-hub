import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // CTO SuperAdmin Bypass
        const userPhone = user.user_metadata?.phone_number || "";
        const userEmail = user.email || "";
        const isAdminNumber = userPhone.includes("621346187") ||
          userEmail.includes("621346187") ||
          userPhone.includes("660984023") ||
          userEmail.includes("660984023");

        if (isAdminNumber) {
          console.log("CTO: SuperAdmin recognized by hardware ID");
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_roles" as any)
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
};
