import AvatarList from "./AvatarList";
import JoinRoomButton from "./JoinRoomButton";

type Props = {
  id: string;
  name: string;
  profiles: {
    email: string;
    image_url: string | null;
    display_name: string | null;
  }[];
};

const RoomItem: React.FC<Props> = ({ id, name, profiles }) => {
  return (
    <div className="flex items-start justify-between rounded-lg bg-white p-4 shadow-md">
      <div>
        <p className="text-md mb-2 font-bold">{name}</p>
        <JoinRoomButton roomId={id} />
      </div>
      <div>
        <AvatarList profiles={profiles} />
      </div>
    </div>
  );
};

export default RoomItem;
