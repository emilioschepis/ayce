import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  roomId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const schema = z.object({
  password: z.string().min(6),
});

type Fields = z.infer<typeof schema>;

const PasswordPanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, formState } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function joinRoom(fields: Fields) {
    const response = await supabaseClient.functions.invoke("join-room", {
      body: JSON.stringify({ roomId: roomId, password: fields.password }),
    });

    if (response.error || response.data.error) {
      setOpen(false);
      return;
    }

    router.push("/rooms/" + roomId);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      className="relative z-50"
      initialFocus={cancelButtonRef}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
          <Dialog.Title>Join the room</Dialog.Title>
          <Dialog.Description>
            To join the room, please insert the password.
          </Dialog.Description>

          <form onSubmit={handleSubmit(joinRoom)}>
            <label htmlFor="password" />
            <input id="password" type="text" {...register("password")} />

            <button
              ref={cancelButtonRef}
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" disabled={formState.isSubmitting}>
              Join
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PasswordPanel;
