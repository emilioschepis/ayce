import { useState } from "react";

import CreateRoomPanel from "./CreateRoomPanel";

type Props = {};

const CreateRoomButton: React.FC<Props> = ({}) => {
  const [isCreatingRoom, setCreatingRoom] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setCreatingRoom(true)}>
        Create room
      </button>
      <CreateRoomPanel isOpen={isCreatingRoom} setOpen={setCreatingRoom} />
    </>
  );
};

export default CreateRoomButton;
