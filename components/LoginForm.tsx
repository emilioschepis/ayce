import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { supabaseClient } from "~/lib/supabase";

type Props = {
  redirectUrl: string;
};

const schema = z.object({
  email: z.string().email().min(2),
});

type Fields = z.infer<typeof schema>;

export const LoginForm: React.FC<Props> = ({ redirectUrl }) => {
  const { register, handleSubmit } = useForm<Fields>({
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
    <form onSubmit={handleSubmit(login)}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        {...register("email", { required: true })}
      />
      <button type="submit">Send magic link</button>
    </form>
  );
};
