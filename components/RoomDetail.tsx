import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{room.name}</h1>
      <DishList roomId={room.id} />
      <button onClick={() => setRecapOpen(true)}>generate recap</button>
      <RecapPanel
        roomId={room.id}
        isOpen={isRecapOpen}
        setOpen={setRecapOpen}
      />
    </div>
  );
};

export default RoomDetail;
