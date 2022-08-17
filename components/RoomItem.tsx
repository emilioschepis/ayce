import AvatarList from "./AvatarList";
import JoinRoomButton from "./JoinRoomButton";

type Props = {
  id: string;
  name: string;
  createdAt: string;
  profiles: {
    email: string;
    image_url: string | null;
    display_name: string | null;
  }[];
};

const RoomItem: React.FC<Props> = ({ id, name, createdAt, profiles }) => {
  return (
    <div className="flex items-start justify-between rounded-lg bg-white p-4 shadow-md">
      <div>
        <p className="text-md font-bold">{name}</p>
        <p className="mb-2">
          <time dateTime={createdAt}>
            {new Date(createdAt).toLocaleString()}
          </time>
        </p>
        <JoinRoomButton roomId={id} />
      </div>
      <div>
        <AvatarList profiles={profiles} />
      </div>
    </div>
  );
};

export default RoomItem;
