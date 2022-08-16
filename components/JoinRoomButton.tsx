import { useRouter } from "next/router";
import { useState } from "react";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { supabaseClient } from "~/lib/supabase";

import PasswordPanel from "./PasswordPanel";

type Props = {
  roomId: string;
};

const JoinRoomButton: React.FC<Props> = ({ roomId }) => {
  const user = useGuaranteedUser();
  const router = useRouter();
  const [isPanelOpen, setPanelOpen] = useState(false);

  async function handleClick() {
    const isGuest = await checkGuest();
    if (isGuest) {
      router.push("/rooms/" + roomId);
      return;
    }

    setPanelOpen(true);
  }

  async function checkGuest(): Promise<boolean> {
    const response = await supabaseClient
      .from("guests")
      .select("*")
      .match({ user_id: user.id, room_id: roomId })
      .maybeSingle();

    if (response.data) {
      return true;
    }

    return false;
  }

  return (
    <>
      <button type="button" onClick={handleClick}>
        Join
      </button>
      <PasswordPanel
        roomId={roomId}
        isOpen={isPanelOpen}
        setOpen={setPanelOpen}
      />
    </>
  );
};

export default JoinRoomButton;
