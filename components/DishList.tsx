import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  roomId: string;
};

const DishList: React.FC<Props> = ({ roomId }) => {
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

      return response.data;
    }
  );

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
