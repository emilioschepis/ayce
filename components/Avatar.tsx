import Image from "next/image";

type Props = {
  email: string;
  display_name: string | null;
  image_url: string | null;
};

const Avatar: React.FC<Props> = ({ email, display_name, image_url }) => {
  if (image_url) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded-full">
        <Image src={image_url} layout="fill" alt={display_name ?? email} />
      </div>
    );
  }

  const initials = (display_name ?? email).substring(0, 2);

  return (
    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-300">
      <p>{initials}</p>
    </div>
  );
};

export default Avatar;
