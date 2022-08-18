import { NextPage } from "next";
import { useRouter } from "next/router";

import Joiner from "~/components/Joiner";
import { useRequiredUser } from "~/lib/AuthContext";

const Join: NextPage = () => {
  const router = useRouter();
  const { user } = useRequiredUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <Joiner />
    </div>
  );
};

export default Join;
