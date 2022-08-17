import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import icon from "../public/icon.png";
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
    <header className="flex items-center justify-between bg-white px-4 py-2 shadow-md">
      <Link href="/">
        <a className="flex items-center">
          <Image src={icon} alt="logo" width={40} height={40} />
          <div className="ml-2 flex flex-col items-start">
            <p className="text-xl font-bold">AYCE</p>
          </div>
        </a>
      </Link>
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
