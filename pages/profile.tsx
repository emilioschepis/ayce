import { NextPage } from "next";

import MainLayout from "~/components/MainLayout";
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
      <MainLayout>
        <ProfileViewer />
      </MainLayout>
    </>
  );
};

export default Profile;
