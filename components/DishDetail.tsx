import { useMutation } from "@tanstack/react-query";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  roomId: string;
  dish: {
    id: string;
    name: string;
    description: string | null;
    choices: unknown;
  };
};

const DishDetail: React.FC<Props> = ({ dish, roomId }) => {
  const userId = useGuaranteedUser().id;
  const choosers = (dish.choices as { profiles: { email: string } }[])
    .map((c) => c.profiles.email)
    .join(", ");

  const { isLoading: isAdding, mutate: add } = useMutation(
    async () => {
      await supabaseClient
        .from("choices")
        .insert({ dish_id: dish.id, user_id: userId, room_id: roomId });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKey.DISHES, roomId]);
      },
    }
  );

  const { isLoading: isRemoving, mutate: remove } = useMutation(
    async () => {
      await supabaseClient
        .from("choices")
        .delete()
        .match({ dish_id: dish.id, user_id: userId, room_id: roomId });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([QueryKey.DISHES, roomId]);
      },
    }
  );

  return (
    <div>
      <p>
        <b>{dish.name}</b>
        {dish.description ? ` (${dish.description})` : null}
      </p>
      <p>{choosers}</p>
      <button disabled={isAdding || isRemoving} onClick={() => add()}>
        add
      </button>
      <button disabled={isAdding || isRemoving} onClick={() => remove()}>
        remove
      </button>
    </div>
  );
};

export default DishDetail;
