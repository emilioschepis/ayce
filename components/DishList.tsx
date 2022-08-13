import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { QueryKey } from "~/lib/query";

type Props = {
  roomId: string;
};

const DishList: React.FC<Props> = ({ roomId }) => {
  const queryClient = useQueryClient();
  const { data: dishes, isLoading } = useQuery(
    [QueryKey.DISHES, roomId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("dishes")
        .select("id, name, description")
        .eq("room_id", roomId)
        .abortSignal(signal!);

      if (response.error) {
        throw response.error;
      }

      return response.data as {
        id: string;
        name: string;
        description?: string;
      }[];
    }
  );

  useEffect(() => {
    let subscription = supabaseClient
      .from("dishes:room_id=eq." + roomId)
      .on("*", (_) => {
        queryClient.refetchQueries([QueryKey.DISHES, roomId]);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(subscription);
    };
  }, [queryClient, roomId]);

  if (isLoading || !dishes) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {dishes.map((dish) => (
          <li key={dish.id}>
            {dish.name} ({dish.description})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishList;
