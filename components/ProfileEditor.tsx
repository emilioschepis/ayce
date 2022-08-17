import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useGuaranteedUser } from "~/lib/AuthContext";
import { queryClient, QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  displayName: string | null;
  imageUrl: string | null;
};

const schema = z.object({
  displayName: z.string().min(2),
  image: z.any(),
});

type Fields = z.infer<typeof schema>;

const ProfileEditor: React.FC<Props> = ({ displayName, imageUrl }) => {
  const userId = useGuaranteedUser().id;
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: displayName ?? undefined,
    },
  });

  async function updateProfile(fields: Fields) {
    const image = (fields.image as FileList).item(0);
    if (!image) {
      await supabaseClient
        .from("profiles")
        .update({
          display_name: fields.displayName,
        })
        .eq("id", userId);

      queryClient.refetchQueries([QueryKey.PROFILE]);
      return;
    }

    const imageExtension = image.name.split(".").pop();
    const imageName = `${userId}_${new Date().getTime()}.${imageExtension}`;

    const { data: pathData } = await supabaseClient.storage
      .from("images")
      .upload(`profiles/${imageName}`, image);

    if (!pathData?.path) {
      return;
    }

    const { data: urlData } = supabaseClient.storage
      .from("images")
      .getPublicUrl(pathData.path);

    await supabaseClient
      .from("profiles")
      .update({
        display_name: fields.displayName,
        image_url: urlData.publicUrl,
      })
      .eq("id", userId);

    queryClient.refetchQueries([QueryKey.PROFILE]);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-lg bg-white p-4 shadow-md">
      {imageUrl ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image src={imageUrl} alt={displayName ?? "profile"} layout="fill" />
        </div>
      ) : null}
      <form
        className="flex flex-col items-stretch"
        onSubmit={handleSubmit(updateProfile)}
      >
        <div className="mt-2">
          <label htmlFor="displayName" className="text-xs font-bold uppercase">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            className="w-full rounded-md"
            placeholder="your name"
            {...register("displayName")}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="displayName" className="text-xs font-bold uppercase">
            Profile picture
          </label>
          <input
            id="image"
            type="file"
            className="w-full"
            {...register("image")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded-md bg-blue-700 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-600"
        >
          Update profile
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;
