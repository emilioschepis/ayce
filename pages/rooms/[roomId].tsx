import type { NextPage } from "next";
import { useRouter } from "next/router";

import RoomDetail from "~/components/RoomDetail";
import { useRequiredUser } from "~/lib/AuthContext";

const Room: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const { user } = useRequiredUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <RoomDetail roomId={roomId} />
    </div>
  );
};

export default Room;
