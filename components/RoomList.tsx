import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import CreateRoomButton from "./CreateRoomButton";
import JoinRoomButton from "./JoinRoomButton";

const RoomList: React.FC = () => {
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

      return response.data;
    }
  );

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
      <CreateRoomButton />
    </div>
  );
};

export default RoomList;
