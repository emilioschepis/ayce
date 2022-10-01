import type { NextPage } from "next";
import Head from "next/head";

import { RegisterForm } from "~/components/RegisterForm";

const Register: NextPage = () => {
  return (
    <div className="h-screen bg-white">
      <Head>
        <title>Register - AYCE</title>
      </Head>
      <RegisterForm />
    </div>
  );
};

export default Register;
