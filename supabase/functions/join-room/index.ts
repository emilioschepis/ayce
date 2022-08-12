import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
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
  const { user } = await client.auth.api.getUser(token);

  const { roomId, password } = await req.json();

  if (typeof roomId !== "string" || typeof password !== "string") {
    return new Response(JSON.stringify({ error: "invalid-parameters" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const response = await client
    .from("passwords")
    .select("password")
    .eq("room_id", roomId)
    .maybeSingle();

  if (!response.data) {
    return new Response(JSON.stringify({ error: "room-not-found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const correctPassword = response.data.password;

  if (password !== correctPassword) {
    return new Response(JSON.stringify({ error: "incorrect-password" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await client.from("guests").upsert({ user_id: user!.id, room_id: roomId });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
