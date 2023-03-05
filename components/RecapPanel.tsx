import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useMemo } from "react";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";
import { asElement, asSafeArray } from "~/lib/utils";

import AvatarList from "./AvatarList";

type Props = {
  roomId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const RecapPanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const { data: dishes } = useQuery(
    [QueryKey.DISHES, roomId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("dishes")
        .select(
          "id, name, description, choices(profiles(email, image_url, display_name))"
        )
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

    const list = dishes
      .filter((d) => asSafeArray(d.choices).length > 0)
      .map((d) => {
        return {
          id: d.id,
          name: d.name,
          amount: asSafeArray(d.choices).length,
          profiles: asSafeArray(d.choices).map((c) => asElement(c.profiles)),
        };
      });

    return list;
  }, [dishes]);

  const numberOfDishes = useMemo(() => {
    if (!dishes) {
      return 0;
    }

    return dishes.reduce(
      (acc, next) => acc + asSafeArray(next.choices).length,
      0
    );
  }, [dishes]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setOpen(false)} className="relative z-50">
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
        <div className="fixed inset-0 p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto flex h-full max-w-lg flex-col rounded-lg bg-white py-8">
              <div className="px-8">
                <Dialog.Title className="text-lg font-bold">
                  Recap for the room
                </Dialog.Title>
                <Dialog.Description className="italic text-gray-800">
                  Here are the {numberOfDishes} dishes you selected.
                </Dialog.Description>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-8 right-8 flex h-8 w-8 items-center justify-center rounded bg-gray-200"
              >
                <XMarkIcon className="h-5 w-5" aria-label="Close panel" />
              </button>
              <ul className="mx-4 mt-2 flex-1 space-y-2 overflow-y-scroll px-4">
                {recapDishes.map((dish, idx) => (
                  <React.Fragment key={dish.id}>
                    {idx > 0 ? (
                      <div className="h-[1px] bg-gray-200" aria-hidden />
                    ) : null}
                    <li className="flex items-center justify-between">
                      <p>
                        <span className="font-bold">{dish.amount}&times;</span>{" "}
                        {dish.name}
                      </p>
                      <AvatarList small profiles={dish.profiles} />
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
