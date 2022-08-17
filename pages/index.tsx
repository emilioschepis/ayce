import type { NextPage } from "next";

import MainLayout from "~/components/MainLayout";
import RoomList from "~/components/RoomList";
import { useRequiredUser } from "~/lib/AuthContext";

const Home: NextPage = () => {
  const { user } = useRequiredUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <MainLayout>
        <RoomList />
      </MainLayout>
    </div>
  );
};

export default Home;
