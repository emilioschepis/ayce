import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Fragment, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  roomId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const RecapPanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { data: dishes } = useQuery(
    [QueryKey.DISHES, roomId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("dishes")
        .select("id, name, description, choices(profiles(email))")
        .eq("room_id", roomId)
        .order("name", { ascending: true })
        .abortSignal(signal!);

      if (response.error) {
        throw response.error;
      }

      return response.data.sort(
        (d1, d2) => parseInt(d1.name) - parseInt(d2.name)
      );
    }
  );

  const recapDishes = useMemo(() => {
    if (!dishes) {
      return [];
    }

    return dishes
      .map((dish) => ({
        id: dish.id,
        name: dish.name,
        amount: (dish.choices as any[]).length,
      }))
      .filter((dish) => dish.amount > 0);
  }, [dishes]);

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
            <Dialog.Panel className="mx-auto flex max-h-screen max-w-md flex-col rounded-lg bg-white p-8">
              <Dialog.Title className="text-lg font-bold">
                Recap for the room
              </Dialog.Title>
              <Dialog.Description className="italic text-gray-800">
                Here are the dishes you selected.
              </Dialog.Description>
              <ul className="mt-2 flex-1 space-y-2 overflow-y-auto">
                {recapDishes.map((dish, idx) => (
                  <React.Fragment key={dish.id}>
                    {idx > 0 ? (
                      <div className="h-[1px] bg-gray-200" aria-hidden />
                    ) : null}
                    <li>
                      <span className="font-bold">{dish.amount}&times;</span>{" "}
                      {dish.name}
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RecapPanel;
