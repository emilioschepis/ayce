import type { NextPage } from "next";
import { useRouter } from "next/router";

import RoomDetail from "~/components/RoomDetail";
import { useRequiredUser } from "~/lib/hooks";

const Room: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  const { user, isLoading } = useRequiredUser();

  if (!roomId || isLoading || !user) {
    return null;
  }

  return (
    <div>
      <RoomDetail roomId={roomId} />
    </div>
  );
};

export default Room;
