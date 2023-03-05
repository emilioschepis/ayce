import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import CreateRoomPanel from "./CreateRoomPanel";

type Props = {};

const CreateRoomButton: React.FC<Props> = ({}) => {
  const [isCreatingRoom, setCreatingRoom] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setCreatingRoom(true)}
        className="flex items-center rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-600 focus:bg-blue-600"
      >
        <PlusCircleIcon className="h-5 w-5" aria-hidden />
        <p className="ml-1 text-sm">Create room</p>
      </button>
      <CreateRoomPanel isOpen={isCreatingRoom} setOpen={setCreatingRoom} />
    </>
  );
};

export default CreateRoomButton;
