import Avatar from "./Avatar";

type Props = {
  small?: boolean;
  profiles: {
    email: string;
    image_url: string | null;
    display_name: string | null;
  }[];
};

const AvatarList: React.FC<Props> = ({ profiles, small = false }) => {
  return (
    <div className="flex items-center -space-x-5">
      {profiles.slice(0, 4).map((profile) => (
        <Avatar
          key={profile.email}
          email={profile.email}
          image_url={profile.image_url}
          display_name={profile.display_name}
          small={small}
        />
      ))}
    </div>
  );
};

export default AvatarList;
