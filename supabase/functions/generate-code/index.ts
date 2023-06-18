import {
  decode,
  encode,
} from "https://deno.land/std@0.178.0/encoding/base64.ts";
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  const client = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const token = req.headers.get("Authorization")!.replace("Bearer ", "");
  const {
    data: { user },
  } = await client.auth.getUser(token);

  const { roomId } = await req.json();

  if (typeof roomId !== "string") {
    return new Response(JSON.stringify({ error: "invalid-parameters" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const response = await client
    .from("rooms")
    .select("id, owner_id, passwords(password)")
    .eq("id", roomId)
    .single();

  if (!response.data) {
    console.error(response.error);

    return new Response(JSON.stringify({ error: "room-not-found" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (response.data.owner_id !== user!.id) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const encodedPassword = encodeURIComponent(
    (response.data.passwords as { password: string }).password
  );

  const qs = `id=${response.data.id}&password=${encodedPassword}`;
  const base64 = encode(qs);

  const url = `https://ayce.vercel.app/join?code=${base64}`;

  const existingUrl = await client.storage
    .from("qrcodes")
    .createSignedUrl(`${roomId}.gif`, 3600);

  if (existingUrl.data?.signedUrl) {
    return new Response(
      JSON.stringify({ url, codeUrl: existingUrl.data.signedUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
  const code = (await qrcode(url)) as unknown as string;

  const upload = await client.storage
    .from("qrcodes")
    .upload(`${roomId}.gif`, decode(code.split(",")[1]), {
      contentType: "image/gif",
      upsert: true,
    });

  if (!upload.data) {
    console.error(upload.error);

    return new Response(JSON.stringify({ error: "upload-failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const signedUrl = await client.storage
    .from("qrcodes")
    .createSignedUrl(upload.data.path, 3600);

  if (!signedUrl.data) {
    console.error(signedUrl.error);

    return new Response(JSON.stringify({ error: "sign-failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ url, codeUrl: signedUrl.data.signedUrl }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
