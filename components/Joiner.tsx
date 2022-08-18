import { useRouter } from "next/router";
import { useEffect } from "react";

import { supabaseClient } from "~/lib/supabase";

type Props = {};

const Joiner: React.FC<Props> = ({}) => {
  const router = useRouter();
  const code = router.query["code"];

  useEffect(() => {
    async function joinRoom(roomId: string, password: string) {
      const response = await supabaseClient.functions.invoke("join-room", {
        body: { roomId, password },
      });

      if (response.error || response.data.error) {
        throw response.error || response.data.error;
      }
    }

    if (typeof code !== "string") {
      return;
    }

    const buffer = Buffer.from(code, "base64");
    const searchParams = new URLSearchParams(buffer.toString());

    const roomId = searchParams.get("id");
    const password = searchParams.get("password");

    if (!roomId || !password) {
      return;
    }

    joinRoom(roomId, password)
      .then(() => router.replace("/rooms/" + roomId))
      .catch(() => router.replace("/"));
  }, [code, router]);

  return null;
};

export default Joiner;
