import { useEffect } from "react";

import { supabaseClient } from "./supabase";

export function useRealtime(
  channel: string,
  table: string,
  filter: string = "",
  callback: () => void
) {
  useEffect(() => {
    // Starting with React 18, useEffect is called twice in development
    // with strict mode active.
    // This usually works fine but may cause some problems with subscriptions.
    // https://github.com/facebook/react/issues/24553
    const shouldUseTimeout = process.env.NODE_ENV !== "production";

    const ch = supabaseClient.channel(channel).on(
      "postgres_changes",
      {
        schema: "public",
        table,
        filter: filter || undefined,
        event: "*",
      },
      (_: unknown) => {
        callback();
      }
    );

    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (shouldUseTimeout) {
      timeout = setTimeout(() => {
        ch.subscribe();
      }, 1000);
    } else {
      ch.subscribe();
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      ch.unsubscribe();
    };
  }, [channel, table, filter, callback]);
}
