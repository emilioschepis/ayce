import { useMutation } from "@tanstack/react-query";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

import AvatarList from "./AvatarList";

type Props = {
  roomId: string;
  isSelected: boolean;
  choosers: {
    id: string;
    email: string;
    image_url: string | null;
    display_name: string | null;
  }[];
  dish: {
    id: string;
    name: string;
    description: string | null;
  };
};

const DishDetail: React.FC<Props> = ({
  dish,
  roomId,
  choosers,
  isSelected,
}) => {
  const userId = useGuaranteedUser().id;

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
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between p-2">
        <div>
          <p className="text-md font-bold text-blue-800">{dish.name}</p>
          {dish.description ? (
            <p className="text-sm text-gray-700">{dish.description}</p>
          ) : (
            <p className="text-sm italic text-gray-700">no description</p>
          )}
        </div>
        <AvatarList profiles={choosers} />
      </div>
      {isSelected ? (
        <button
          disabled={isAdding || isRemoving}
          onClick={() => remove()}
          className="h-8 w-full bg-green-600 text-xs font-bold uppercase text-white"
        >
          Selected
        </button>
      ) : (
        <button
          disabled={isAdding || isRemoving}
          onClick={() => add()}
          className="h-8 w-full bg-gray-600 text-xs font-bold uppercase text-white"
        >
          Tap to select
        </button>
      )}
    </div>
  );
};

export default DishDetail;
