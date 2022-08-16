import type { NextPage } from "next";

import RoomList from "~/components/RoomList";
import { useRequiredUser } from "~/lib/AuthContext";

const Home: NextPage = () => {
  const { user } = useRequiredUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <RoomList />
    </div>
  );
};

export default Home;
