import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { QueryKey } from "./query";

export function useRequiredUser(
  options: { redirectTo: string } = { redirectTo: "/login" }
) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user.isLoading && !user.user) {
      const isMagicLink = router.asPath.includes("type=magiclink");

      if (!isMagicLink) {
        router.replace(options.redirectTo);
      }
    }
  }, [router, user.isLoading, user.user, options.redirectTo]);

  return { user: user.user, isLoading: user.isLoading };
}

export function useProfile() {
  const { user, isLoading } = useUser();
  const { data: profile, isLoading: isQueryLoading } = useQuery(
    [QueryKey.PROFILE, user?.id],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("profiles")
        .select("email, display_name, image_url")
        .eq("id", user!.id)
        .abortSignal(signal!)
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data as {
        email: string;
        display_name?: string;
        image_url?: string;
      };
    },
    {
      enabled: !!user,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  return { profile, isLoading: isLoading || isQueryLoading };
}
