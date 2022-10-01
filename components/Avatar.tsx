import Image from "next/future/image";

type Props = {
  email: string;
  display_name: string | null;
  image_url: string | null;
};

const Avatar: React.FC<Props> = ({ email, display_name, image_url }) => {
  if (image_url) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-gray-500">
        <Image
          src={image_url}
          alt={display_name ?? email}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
    );
  }

  const initials = (display_name ?? email).substring(0, 2);

  return (
    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 bg-gray-300 text-sm font-bold uppercase">
      <p>{initials}</p>
    </div>
  );
};

export default Avatar;
