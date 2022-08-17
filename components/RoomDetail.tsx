import { ClipboardListIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import AddDishButton from "./AddDishButton";
import DishList from "./DishList";
import RecapPanel from "./RecapPanel";

type Props = {
  roomId: string;
};

const RoomDetail: React.FC<Props> = ({ roomId }) => {
  const [isRecapOpen, setRecapOpen] = useState(false);
  const { data: room, isLoading } = useQuery(
    [QueryKey.ROOMS, roomId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("rooms")
        .select("id, name")
        .eq("id", roomId)
        .abortSignal(signal!)
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  );

  if (isLoading || !room) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold">{room.name}</h1>
        <div className="mt-2 md:mt-0">
          <AddDishButton roomId={room.id} />
        </div>
      </div>
      <DishList roomId={room.id} />

      <button
        type="button"
        onClick={() => setRecapOpen(true)}
        className="flex w-full items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
      >
        <ClipboardListIcon className="h-5 w-5" aria-hidden />
        <p className="ml-1 text-sm">Generate recap</p>
      </button>
      <RecapPanel
        roomId={room.id}
        isOpen={isRecapOpen}
        setOpen={setRecapOpen}
      />
    </div>
  );
};

export default RoomDetail;
