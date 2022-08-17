import { PlusCircleIcon } from "@heroicons/react/outline";
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
    <>
      <div>
        <button
          type="button"
          onClick={() => setAddingDish(true)}
          className="flex items-center rounded-md bg-blue-700 px-3 py-1 text-white hover:bg-blue-600 focus:bg-blue-600"
        >
          <PlusCircleIcon className="h-5 w-5" aria-hidden />
          <p className="ml-1">Add dish</p>
        </button>
        <ul className="mt-4">
          {dishes.map((dish) => (
            <li key={dish.id} className="mb-2">
              <DishDetail dish={dish} roomId={roomId} />
            </li>
          ))}
        </ul>
      </div>
      <DishPanel
        roomId={roomId}
        isOpen={isAddingDish}
        setOpen={setAddingDish}
      />
    </>
  );
};

export default DishList;
