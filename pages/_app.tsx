import "../styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import Head from "next/head";

import AuthContext from "~/lib/AuthContext";
import { supabaseClient } from "~/lib/supabase";

import { queryClient } from "../lib/query";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png"></link>
        <meta name="theme-color" content="#1d4ed8" />
      </Head>
      <AuthContext client={supabaseClient}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AuthContext>
    </>
  );
}

export default MyApp;
