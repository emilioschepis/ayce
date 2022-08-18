import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
    },
  },
});

export enum QueryKey {
  "PROFILE" = "PROFILE",
  "ROOMS" = "ROOMS",
  "DISHES" = "DISHES",
  "CODE" = "CODE",
}
