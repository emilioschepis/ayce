import { SparklesIcon } from "@heroicons/react/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { supabaseClient } from "~/lib/supabase";

import icon from "../public/icon.png";

type Props = {
  redirectUrl: string;
};

const schema = z.object({
  email: z.string().email().min(2),
});

type Fields = z.infer<typeof schema>;

export const LoginForm: React.FC<Props> = ({ redirectUrl }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function login(fields: Fields) {
    try {
      const response = await supabaseClient.auth.signInWithOtp({
        email: fields.email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (response.error) {
        throw response.error;
      }
    } catch (error) {
      console.error("Error while authenticating:", error);
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
        onSubmit={handleSubmit(login)}
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
          {...register("email", { required: true })}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
        >
          <SparklesIcon className="h-5 w-5" aria-hidden />
          <p className="ml-1 text-sm">Get magic link</p>
        </button>
      </form>
    </div>
  );
};
