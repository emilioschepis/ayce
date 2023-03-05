import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  roomId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

type Fields = z.infer<typeof schema>;

const DishPanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const userId = useGuaranteedUser().id;
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, reset, formState } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function checkDish(name: string) {
    const response = await supabaseClient
      .from("dishes")
      .select("id")
      .match({ room_id: roomId, name })
      .maybeSingle();

    return response.data?.id;
  }

  async function addDish(fields: Fields) {
    let dishId = await checkDish(fields.name);

    // If no dish with that name exists, create one
    if (!dishId) {
      const { data } = await supabaseClient
        .from("dishes")
        .insert({
          room_id: roomId,
          name: fields.name,
          description: fields.description ?? null,
        })
        .select("id")
        .single();

      dishId = data!.id;
    }

    // Add the created (or existing) dish to the user's choices
    await supabaseClient
      .from("choices")
      .insert({ dish_id: dishId, room_id: roomId, user_id: userId });

    // Update the dishes on screen
    await queryClient.refetchQueries([QueryKey.DISHES, roomId]);

    reset();
    setOpen(false);
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
                Add a dish
              </Dialog.Title>
              <Dialog.Description className="italic text-gray-800">
                To add a dish, insert the name on the menu
              </Dialog.Description>

              <form onSubmit={handleSubmit(addDish)}>
                <div className="flex flex-col">
                  <div className="mt-2">
                    <label
                      htmlFor="name"
                      className="mb-1 text-xs font-bold uppercase"
                    >
                      Item number
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full rounded-md"
                      placeholder="23"
                      disabled={formState.isSubmitting}
                      {...register("name")}
                    />
                  </div>

                  <div className="mt-2">
                    <label
                      htmlFor="description"
                      className="mb-1 text-xs font-bold uppercase"
                    >
                      Name of the dish
                    </label>
                    <input
                      id="description"
                      type="text"
                      className="w-full rounded-md"
                      placeholder="Salmon Gunkan"
                      disabled={formState.isSubmitting}
                      {...register("description")}
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
                      Add
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

export default DishPanel;
