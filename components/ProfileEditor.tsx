import { zodResolver } from "@hookform/resolvers/zod";
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
    <form onSubmit={handleSubmit(updateProfile)}>
      <label htmlFor="displayName">Display name</label>
      <input id="displayName" type="text" {...register("displayName")} />

      <label htmlFor="image">Profile picture</label>
      <input id="image" type="file" {...register("image")} />

      <button type="submit" disabled={isSubmitting}>
        Update profile
      </button>
    </form>
  );
};

export default ProfileEditor;
