import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { QueryKey } from "~/lib/query";

import JoinRoomButton from "./JoinRoomButton";

const RoomList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: rooms, isLoading } = useQuery(
    [QueryKey.ROOMS],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("rooms")
        .select("id, name")
        .abortSignal(signal!)
        .order("created_at");

      if (response.error) {
        throw response.error;
      }

      return response.data as { id: string; name: string }[];
    }
  );

  useEffect(() => {
    let subscription = supabaseClient
      .from("rooms")
      .on("*", (_) => {
        queryClient.refetchQueries([QueryKey.ROOMS]);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(subscription);
    };
  }, [queryClient]);

  return (
    <div>
      <h1>Rooms</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul>
            {rooms?.map((room) => (
              <li key={room.id}>
                {room.name} <JoinRoomButton roomId={room.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoomList;
