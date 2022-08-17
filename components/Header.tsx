import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import Avatar from "./Avatar";

type Props = {};

const Header: React.FC<Props> = ({}) => {
  const userId = useGuaranteedUser().id;
  const { data: profile } = useQuery(
    [QueryKey.PROFILE, userId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("profiles")
        .select("email, display_name, image_url")
        .eq("id", userId)
        .abortSignal(signal!)
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  );

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div>
        <Link href="/">
          <a className="text-xl font-bold">All You Can Eat</a>
        </Link>
      </div>
      <div>
        {profile ? (
          <Link href="profile">
            <a className="flex items-center space-x-2">
              <p className="text-lg">{profile.display_name ?? profile.email}</p>
              <Avatar
                email={profile.email}
                display_name={profile.display_name}
                image_url={profile.image_url}
              />
            </a>
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
