import { Dialog } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const { data: dishes, isLoading } = useQuery(
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

      return response.data;
    }
  );

  return (
    <Dialog
      open={isOpen && !isLoading}
      onClose={() => setOpen(false)}
      className="relative z-50"
      initialFocus={cancelButtonRef}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
          <Dialog.Title>Recap for the room</Dialog.Title>
          <Dialog.Description>Here are your chosen dishes.</Dialog.Description>
          <ul>
            {dishes?.map((dish) => {
              const howMany = (
                dish.choices as { profiles: { email: string } }[]
              ).length;

              if (howMany === 0) return null;

              return (
                <li key={dish.id}>
                  {howMany}&times; {dish.name}
                </li>
              );
            })}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RecapPanel;
