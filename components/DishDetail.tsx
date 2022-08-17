import { useMutation } from "@tanstack/react-query";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import Avatar from "./Avatar";

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
  const choosers = (
    dish.choices as {
      profiles: {
        email: string;
        image_url: string | null;
        display_name: string | null;
      };
    }[]
  ).map((choice) => choice.profiles);

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
      <div className="flex">
        {choosers.map((chooser) => (
          <Avatar
            key={chooser.email}
            email={chooser.email}
            image_url={chooser.image_url}
            display_name={chooser.display_name}
          />
        ))}
      </div>
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
