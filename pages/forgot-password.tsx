import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { ForgotPasswordForm } from "~/components/ForgotPasswordForm";

const ForgotPassword: NextPage<{ redirectTo: string }> = ({ redirectTo }) => {
  return (
    <div className="h-screen bg-white">
      <Head>
        <title>Forgot password - AYCE</title>
      </Head>
      <ForgotPasswordForm redirectTo={redirectTo} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const redirectTo = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/change-password`
    : "http://localhost:3000/change-password";

  return {
    props: {
      redirectTo,
    },
  };
};

export default ForgotPassword;
