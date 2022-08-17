import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const schema = z.object({
  name: z.string().min(3),
  password: z.string().min(3),
});

type Fields = z.infer<typeof schema>;

const CreateRoomPanel: React.FC<Props> = ({ isOpen, setOpen }) => {
  const router = useRouter();
  const userId = useGuaranteedUser().id;
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, formState } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function createRoom(fields: Fields) {
    const response = await supabaseClient.functions.invoke("create-room", {
      body: {
        name: fields.name,
        password: fields.password,
      },
    });

    if (response.error || response.data.error) {
      setOpen(false);
      return;
    }

    router.push("/rooms/" + response.data.roomId);
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
          <Dialog.Title>Create a room</Dialog.Title>
          <Dialog.Description>
            Choose a name and a password, then share them with the guests of the
            room.
          </Dialog.Description>

          <form onSubmit={handleSubmit(createRoom)}>
            <label htmlFor="name" />
            <input id="name" type="text" {...register("name")} />
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
              Create
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateRoomPanel;
