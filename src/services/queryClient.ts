import {QueryClient, useQueryClient} from "@tanstack/vue-query";

let client: QueryClient;
export const getQueryClient = () => client;
export const initQueryClient = () => client = useQueryClient();