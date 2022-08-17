import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0-rc.1";

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

  const { name, password } = await req.json();

  if (typeof name !== "string" || typeof password !== "string") {
    return new Response(JSON.stringify({ error: "invalid-parameters" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const response = await client
    .from("rooms")
    .insert({ name, owner_id: user!.id })
    .select("id")
    .single();

  if (!response.data) {
    console.error(response.error);

    return new Response(JSON.stringify({ error: "room-not-found" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await client
    .from("passwords")
    .insert({ room_id: response.data.id, password });

  await client
    .from("guests")
    .insert({ room_id: response.data.id, user_id: user!.id });

  return new Response(JSON.stringify({ roomId: response.data.id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
