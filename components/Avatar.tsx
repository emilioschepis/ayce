import Image from "next/image";

type Props = {
  email: string;
  display_name: string | null;
  image_url: string | null;
  small?: boolean;
};

const Avatar: React.FC<Props> = ({
  email,
  display_name,
  image_url,
  small = false,
}) => {
  if (image_url) {
    return (
      <div
        className={`relative overflow-hidden rounded-full border-2 border-gray-500 ${
          small ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <Image
          src={image_url}
          alt={display_name ?? email}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const initials = (display_name ?? email).substring(0, 2);

  return (
    <div
      className={`relative flex  items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 bg-gray-300 text-sm font-bold uppercase ${
        small ? "h-10 w-10" : "h-12 w-12"
      }`}
    >
      <p className={small ? "text-sm" : undefined}>{initials}</p>
    </div>
  );
};

export default Avatar;
