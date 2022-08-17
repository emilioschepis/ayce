import type { NextPage } from "next";
import { useRouter } from "next/router";

import MainLayout from "~/components/MainLayout";
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
      <MainLayout>
        <RoomDetail roomId={roomId} />
      </MainLayout>
    </div>
  );
};

export default Room;
