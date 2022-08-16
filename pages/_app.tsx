import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";

import AuthContext from "~/lib/AuthContext";
import { supabaseClient } from "~/lib/supabase";

import { queryClient } from "../lib/query";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContext client={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthContext>
  );
}

export default MyApp;
