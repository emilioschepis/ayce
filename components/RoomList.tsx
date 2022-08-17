import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import CreateRoomButton from "./CreateRoomButton";
import JoinRoomButton from "./JoinRoomButton";
import RoomItem from "./RoomItem";

const RoomList: React.FC = () => {
  const { data: rooms, isLoading } = useQuery(
    [QueryKey.ROOMS],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("rooms")
        .select("id, name, guests(profiles(email, image_url, display_name))")
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Rooms</h1>
          <p className="italic text-gray-800">
            Select the room you want to join.
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <CreateRoomButton />
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? null : (
          <div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms?.map((room) => {
                const profiles = (
                  room.guests as {
                    profiles: {
                      email: string;
                      image_url: string | null;
                      display_name: string | null;
                    };
                  }[]
                ).map((g) => g.profiles);

                return (
                  <li key={room.id}>
                    <RoomItem
                      id={room.id}
                      name={room.name}
                      profiles={profiles}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
