import type { NextPage } from "next";
import Head from "next/head";

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
      <Head>
        <title>AYCE - All You Can Eat companion</title>
        <meta
          name="description"
          content="All You Can Eat companion to track the selected dishes from a menu"
        />
      </Head>
      <MainLayout>
        <RoomList />
      </MainLayout>
    </div>
  );
};

export default Home;
