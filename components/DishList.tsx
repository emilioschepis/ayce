import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import DishDetail from "./DishDetail";
import DishPanel from "./DishPanel";

type Props = {
  roomId: string;
};

const DishList: React.FC<Props> = ({ roomId }) => {
  const [isAddingDish, setAddingDish] = useState(false);
  const { data: dishes, isLoading } = useQuery(
    [QueryKey.DISHES, roomId],
    async ({ signal }) => {
      const response = await supabaseClient
        .from("dishes")
        .select("id, name, description, choices(profiles(email))")
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
            <DishDetail dish={dish} roomId={roomId} />
          </li>
        ))}
      </ul>
      <button onClick={() => setAddingDish(true)}>Add dish</button>
      <DishPanel
        roomId={roomId}
        isOpen={isAddingDish}
        setOpen={setAddingDish}
      />
    </div>
  );
};

export default DishList;
