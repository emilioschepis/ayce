import { PlusCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";

import DishPanel from "./DishPanel";

type Props = {
  roomId: string;
};

const AddDishButton: React.FC<Props> = ({ roomId }) => {
  const [isAddingDish, setAddingDish] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAddingDish(true)}
        className="flex items-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
      >
        <PlusCircleIcon className="h-5 w-5" aria-hidden />
        <p className="ml-1 text-sm">Add dish</p>
      </button>
      <DishPanel
        roomId={roomId}
        isOpen={isAddingDish}
        setOpen={setAddingDish}
      />
    </>
  );
};

export default AddDishButton;
