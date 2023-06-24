import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { useRealtime } from "~/lib/hooks";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import DishDetail from "./DishDetail";

type Props = {
  roomId: string;
  isFiltering: boolean;
};

export function getChoosers(dish: {
  id: string;
  name: string;
  description: string | null;
  choices: unknown;
}) {
  return (
    dish.choices as {
      profiles: {
        id: string;
        email: string;
        image_url: string | null;
        display_name: string | null;
      };
    }[]
  ).map((choice) => choice.profiles);
}

export function isSelected(
  userId: string,
  dish: {
    id: string;
    name: string;
    description: string | null;
    choices: unknown;
  }
) {
  return !!getChoosers(dish).find((c) => c.id === userId);
}

const DishList: React.FC<Props> = ({ roomId, isFiltering }) => {
  const userId = useGuaranteedUser().id;
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

      return response.data.sort(
        (d1, d2) => parseInt(d1.name) - parseInt(d2.name)
      );
    }
  );

  const onTablesChanged = useCallback(
    () => queryClient.refetchQueries([QueryKey.DISHES, roomId]),
    [roomId]
  );
  useRealtime(
    `dishes_${roomId}`,
    "dishes",
    `room_id=eq.${roomId}`,
    onTablesChanged
  );
  useRealtime(
    `choices_${roomId}`,
    "choices",
    `room_id=eq.${roomId}`,
    onTablesChanged
  );

  if (isLoading || !dishes) {
    return null;
  }

  return (
    <div>
      <ul className="mt-4">
        {dishes
          .filter((d) => (isFiltering ? isSelected(userId, d) : true))
          .map((dish) => {
            const choosers = getChoosers(dish);

            return (
              <li key={dish.id} className="mb-2">
                <DishDetail
                  dish={dish}
                  roomId={roomId}
                  choosers={choosers}
                  isSelected={isFiltering || isSelected(userId, dish)}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default DishList;
