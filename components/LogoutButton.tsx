import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { queryClient } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await supabaseClient.auth.signOut(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  return (
    <button
      type="button"
      disabled={mutation.isLoading}
      className="flex items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
      onClick={() => mutation.mutate()}
    >
      <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden />
      <p className="ml-1 text-sm">Logout</p>
    </button>
  );
};

export default LogoutButton;
