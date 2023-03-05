import { KeyIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "~/lib/AuthContext";
import { supabaseClient } from "~/lib/supabase";

import icon from "../public/icon.png";

type Props = {};

const schema = z.object({
  password: z.string().min(6),
});

type Fields = z.infer<typeof schema>;

export const ChangePasswordForm: React.FC<Props> = ({}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });
  const { user } = useUser();

  async function changePassword(fields: Fields) {
    try {
      const response = await supabaseClient.auth.updateUser({
        password: fields.password,
      });

      if (response.error) {
        throw response.error;
      }

      await router.replace("/");
    } catch (error) {
      console.error("Error while changing password:", error);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg  bg-white p-4 shadow-md">
      <div className="mb-2 flex justify-center">
        <Image src={icon} alt="logo" width={80} height={80} />
      </div>
      <h1 className="text-xl font-bold">Welcome to AYCE</h1>
      <p className="mb-4 italic text-gray-700">Choose your new password</p>
      <form
        className="flex flex-col items-stretch"
        onSubmit={handleSubmit(changePassword)}
      >
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
          <KeyIcon className="h-5 w-5" aria-hidden />
          <p className="ml-1 text-sm">Save password</p>
        </button>
      </form>
    </div>
  );
};
