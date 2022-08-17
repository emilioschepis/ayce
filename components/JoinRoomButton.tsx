import { UserAddIcon } from "@heroicons/react/outline";
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
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center rounded-md bg-blue-700 px-3 py-1 text-white hover:bg-blue-600 focus:bg-blue-600"
      >
        <UserAddIcon className="h-5 w-5" aria-hidden />
        <p className="ml-1">Join</p>
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
