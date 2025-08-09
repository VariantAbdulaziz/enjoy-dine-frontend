import { DEFAULT_SERVER_ERROR_MESSAGE, createSafeActionClient } from "next-safe-action";
import axios from "axios";

import { getSession } from "@/lib/session";

import { ActionError } from "./unsafe-action";
import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const context = await getCloudflareContext({ async: true });
const API_BASE_URL = context.env.API_BASE_URL || "http://localhost:8000/api/v1";

export const authenticatedAction = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof ActionError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-type": "application/json",
      withCredentials: true,
    },
  });
  const session = await getSession();
  if (!session) {
    throw new ActionError("User is not authenticated");
  }
  api.interceptors.request.use(
    async (config: any) => {
      if (session.access) {
        config.headers["Authorization"] = `Bearer ${session.access}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  return next({ ctx: { session: session, api } });
});

export const lichessAuthenticatedAction = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof ActionError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const lichessApi = axios.create({
    baseURL: "https://lichess.org/api",
    headers: {
      "Content-type": "application/json",
      withCredentials: true,
    },
  });

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-type": "application/json",
      withCredentials: true,
    },
  });
  const session = await getSession();
  if (!session) {
    throw new ActionError("User is not authenticated");
  }
  if (!session.lichess || !session.lichess.access) {
    redirect("/connect-lichess");
  }
  lichessApi.interceptors.request.use(
    async (config: any) => {
      if (session.access) {
        config.headers["Authorization"] = `Bearer ${session.lichess?.access}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.request.use(
    async (config: any) => {
      if (session.access) {
        config.headers["Authorization"] = `Bearer ${session.access}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  return next({ ctx: { session: session, lichessApi, api } });
});
