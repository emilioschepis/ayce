import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

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
    </div>
  );
};

export default ProfileViewer;
