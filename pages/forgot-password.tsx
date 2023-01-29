import type { NextPage } from "next";
import Head from "next/head";

import { ForgotPasswordForm } from "~/components/ForgotPasswordForm";

const ForgotPassword: NextPage = () => {
  return (
    <div className="h-screen bg-white">
      <Head>
        <title>Forgot password - AYCE</title>
      </Head>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
