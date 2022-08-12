import type { NextPage } from "next";

import RoomList from "~/components/RoomList";
import { useRequiredUser } from "~/lib/hooks";

const Home: NextPage = () => {
  const { user, isLoading } = useRequiredUser();

  if (isLoading || !user) {
    return null;
  }

  return (
    <div>
      <RoomList />
    </div>
  );
};

export default Home;
