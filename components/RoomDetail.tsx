import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "~/lib/query";

import DishList from "./DishList";

type Props = {
  roomId: string;
};

const RoomDetail: React.FC<Props> = ({ roomId }) => {
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

      return response.data as { id: string; name: string };
    }
  );

  if (isLoading || !room) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{room.name}</h1>
      <DishList roomId={room.id} />
    </div>
  );
};

export default RoomDetail;
