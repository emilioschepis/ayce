import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import DishDetail from "./DishDetail";

type Props = {
  roomId: string;
};

const DishList: React.FC<Props> = ({ roomId }) => {
  const { data: dishes, isLoading } = useQuery(
    [QueryKey.DISHES, roomId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("dishes")
        .select(
          "id, name, description, choices(profiles(id, email, display_name, image_url))"
        )
        .eq("room_id", roomId)
        .order("name", { ascending: true })
        .abortSignal(signal!);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  );

  if (isLoading || !dishes) {
    return null;
  }

  return (
    <div>
      <ul className="mt-4">
        {dishes.map((dish) => (
          <li key={dish.id} className="mb-2">
            <DishDetail dish={dish} roomId={roomId} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishList;
