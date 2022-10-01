import type { NextPage } from "next";
import Head from "next/head";

import { LoginForm } from "~/components/LoginForm";

const Login: NextPage = () => {
  return (
    <div className="h-screen bg-white">
      <Head>
        <title>Login - AYCE</title>
      </Head>
      <LoginForm />
    </div>
  );
};

export default Login;
