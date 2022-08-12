import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({});

export enum QueryKey {
  "PROFILE" = "PROFILE",
  "ROOMS" = "ROOMS",
}
