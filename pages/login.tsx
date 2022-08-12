import type { GetServerSideProps, NextPage } from "next";

import { LoginForm } from "~/components/LoginForm";

type Props = {
  redirectUrl: string;
};

const Login: NextPage<Props> = ({ redirectUrl }) => {
  return (
    <div>
      <LoginForm redirectUrl={redirectUrl} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const redirectUrl = process.env.VERCEL
    ? req.headers["x-forwarded-host"]
    : "http://localhost:3000";

  return {
    props: {
      redirectUrl,
    },
  };
};

export default Login;
