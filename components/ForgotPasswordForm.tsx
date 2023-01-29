import { MailIcon } from "@heroicons/react/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { supabaseClient } from "~/lib/supabase";

import icon from "../public/icon.png";

type Props = {
  redirectTo: string;
};

const schema = z.object({
  email: z.string().email().min(2),
});

type Fields = z.infer<typeof schema>;

export const ForgotPasswordForm: React.FC<Props> = ({ redirectTo }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function resetPassword(fields: Fields) {
    try {
      const response = await supabaseClient.auth.resetPasswordForEmail(
        fields.email,
        { redirectTo }
      );

      if (response.error) {
        throw response.error;
      }

      await router.replace("/");
    } catch (error) {
      console.error("Error while resetting password:", error);
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg  bg-white p-4 shadow-md">
      <div className="mb-2 flex justify-center">
        <Image src={icon} alt="logo" width={80} height={80} />
      </div>
      <h1 className="text-xl font-bold">Welcome to AYCE</h1>
      <p className="mb-4 italic text-gray-700">
        Enter your email to receive a password reset link.
      </p>
      <form
        className="flex flex-col items-stretch"
        onSubmit={handleSubmit(resetPassword)}
      >
        <label htmlFor="email" className="mb-1 text-xs font-bold uppercase">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mb-4 w-full rounded-md"
          placeholder="you@email.com"
          {...register("email", { required: true, minLength: 2 })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
        >
          <MailIcon className="h-5 w-5" aria-hidden />
          <p className="ml-1 text-sm">Receive link</p>
        </button>
        <p className="mt-3 self-center">
          Sign in with a different account?{" "}
          <Link href="/login">
            <a className="text-blue-700 underline hover:text-blue-600">
              Sign in now
            </a>
          </Link>
        </p>
      </form>
    </div>
  );
};
