import type { NextPage } from "next";
import Head from "next/head";

import { ChangePasswordForm } from "~/components/ChangePasswordForm";

const ChangePassword: NextPage = () => {
  return (
    <div className="h-screen bg-white">
      <Head>
        <title>Change password - AYCE</title>
      </Head>
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePassword;
