import { NextPage } from "next";

import ProfileEditor from "~/components/ProfileEditor";
import ProfileViewer from "~/components/ProfileViewer";
import { useRequiredUser } from "~/lib/AuthContext";

const Profile: NextPage = () => {
  const { user } = useRequiredUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <ProfileViewer />
    </>
  );
};

export default Profile;
