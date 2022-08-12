import type { NextPage } from "next";

import { useRequiredUser } from "~/lib/hooks";

const Home: NextPage = () => {
  const { user, isLoading } = useRequiredUser();

  if (isLoading || !user) {
    return null;
  }

  return <div>{user.id}</div>;
};

export default Home;
