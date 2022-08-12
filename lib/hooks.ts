import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
