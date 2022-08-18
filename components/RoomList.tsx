import { RealtimeChannel, Subscription } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { useRealtime } from "~/lib/hooks";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import CreateRoomButton from "./CreateRoomButton";
import RoomItem from "./RoomItem";

const RoomList: React.FC = () => {
  const { data: rooms, isLoading } = useQuery(
    [QueryKey.ROOMS],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("rooms")
        .select(
          "id, name, created_at, guests(profiles(email, image_url, display_name))"
        )
        .abortSignal(signal!)
        .order("created_at", { ascending: false });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  );

  const onTablesChanged = useCallback(
    () => queryClient.refetchQueries([QueryKey.ROOMS]),
    []
  );
  useRealtime("rooms", "rooms", "", onTablesChanged);

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
                      createdAt={room.created_at}
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
