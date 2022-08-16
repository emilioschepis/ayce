import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
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
  name: z.string(),
  description: z.string().optional(),
});

type Fields = z.infer<typeof schema>;

const DishPanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const userId = useGuaranteedUser().id;
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, formState } = useForm<Fields>({
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
    setOpen(false);
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
          <Dialog.Title>Add a dish</Dialog.Title>
          <Dialog.Description>
            To add a dish, insert the name on the menu
          </Dialog.Description>

          <form onSubmit={handleSubmit(addDish)}>
            <label htmlFor="name" />
            <input id="name" type="text" {...register("name")} />

            <label htmlFor="description" />
            <input id="description" type="text" {...register("description")} />

            <button
              ref={cancelButtonRef}
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" disabled={formState.isSubmitting}>
              Add
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DishPanel;
