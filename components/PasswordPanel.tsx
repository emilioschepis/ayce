import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { supabaseClient } from "~/lib/supabase";

type Props = {
  roomId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const schema = z.object({
  password: z.string().min(3).trim(),
});

type Fields = z.infer<typeof schema>;

const PasswordPanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, formState, setError } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function joinRoom(fields: Fields) {
    const response = await supabaseClient.functions.invoke("join-room", {
      body: { roomId: roomId, password: fields.password.trim() },
    });

    if (response.error || response.data.error) {
      setError("password", { message: "Could not join room" });
      return;
    }

    router.push("/rooms/" + roomId);
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
                Join the room
              </Dialog.Title>
              <Dialog.Description className="italic text-gray-800">
                To join the room, please insert the password
              </Dialog.Description>

              <form onSubmit={handleSubmit(joinRoom)}>
                <div className="flex flex-col">
                  <div className="mt-2">
                    <label
                      htmlFor="password"
                      className="mb-1 text-xs font-bold uppercase"
                    >
                      Room password
                    </label>
                    <input
                      id="password"
                      type="text"
                      className="w-full rounded-md"
                      placeholder="password"
                      aria-errormessage="password-error"
                      {...register("password")}
                    />
                    {formState.errors.password ? (
                      <p
                        id="password-error"
                        className="mt-1 text-sm text-red-600"
                      >
                        {formState.errors.password.message}
                      </p>
                    ) : null}
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
                      Join
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

export default PasswordPanel;
