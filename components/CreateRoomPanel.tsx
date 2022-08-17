import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={() => setOpen(false)}
        className="relative z-50"
        initialFocus={cancelButtonRef}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            aria-hidden="true"
          />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-8">
              <Dialog.Title className="text-lg font-bold">
                Create a room
              </Dialog.Title>
              <Dialog.Description className="italic text-gray-800">
                Choose a name and a password, then share them with the guests of
                the room.
              </Dialog.Description>

              <form onSubmit={handleSubmit(createRoom)}>
                <div className="flex flex-col">
                  <div className="mt-4">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase"
                    >
                      Room name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full rounded-md"
                      placeholder="my room name"
                      {...register("name")}
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold uppercase"
                    >
                      Room password
                    </label>
                    <input
                      id="password"
                      type="text"
                      className="w-full rounded-md"
                      placeholder="password"
                      {...register("password")}
                    />
                  </div>

                  <div className="mt-4 self-end">
                    <button
                      ref={cancelButtonRef}
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mr-2 rounded-md px-3 py-1 text-blue-700 hover:bg-blue-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formState.isSubmitting}
                      className="rounded-md bg-blue-700 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-600"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateRoomPanel;
