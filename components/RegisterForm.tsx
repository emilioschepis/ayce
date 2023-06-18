import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { supabaseClient } from "~/lib/supabase";

import icon from "../public/icon.png";

type Props = {};

const schema = z.object({
  email: z.string().email().min(2),
  password: z.string().min(6),
});

type Fields = z.infer<typeof schema>;

export const RegisterForm: React.FC<Props> = ({}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function create(fields: Fields) {
    try {
      const response = await supabaseClient.auth.signUp({
        email: fields.email,
        password: fields.password,
      });

      if (response.error) {
        throw response.error;
      }

      const redirectTo = localStorage.getItem("redirectTo");
      if (redirectTo?.startsWith("/")) {
        localStorage.removeItem("redirectTo");
        await router.replace(redirectTo);
      } else {
        await router.replace("/");
      }
    } catch (error) {
      console.error("Error while registering:", error);
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg  bg-white p-4 shadow-md">
      <div className="mb-2 flex justify-center">
        <Image src={icon} alt="logo" width={80} height={80} />
      </div>
      <h1 className="text-xl font-bold">Welcome to AYCE</h1>
      <p className="mb-4 italic text-gray-700">
        Create your own room and invite guests, start selecting dishes and
        create a simple recap to fill the order sheet.
      </p>
      <form
        className="flex flex-col items-stretch"
        onSubmit={handleSubmit(create)}
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
        <label htmlFor="password" className="mb-1 text-xs font-bold uppercase">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="mb-4 w-full rounded-md"
          placeholder="your password"
          {...register("password", { required: true, minLength: 6 })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden />
          <p className="ml-1 text-sm">Register</p>
        </button>
        <p className="mt-3 self-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-700 underline hover:text-blue-600"
          >
            Sign in now
          </Link>
        </p>
      </form>
    </div>
  );
};
