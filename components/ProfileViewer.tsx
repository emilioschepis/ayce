import { useQuery } from "@tanstack/react-query";
import Head from "next/head";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import LogoutButton from "./LogoutButton";
import ProfileEditor from "./ProfileEditor";

type Props = {};

const ProfileViewer: React.FC<Props> = ({}) => {
  const userId = useGuaranteedUser().id;
  const { data: profile, isLoading } = useQuery(
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

  if (isLoading || !profile) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>
          {profile.display_name
            ? `${profile.display_name}'s profile`
            : "Profile"}{" "}
          - AYCE
        </title>
      </Head>
      <ProfileEditor
        displayName={profile.display_name}
        imageUrl={profile.image_url}
      />
      <div className="mx-auto mt-4 flex max-w-md flex-col items-stretch rounded-lg bg-white p-4 shadow-md">
        <LogoutButton />
      </div>
    </div>
  );
};

export default ProfileViewer;
