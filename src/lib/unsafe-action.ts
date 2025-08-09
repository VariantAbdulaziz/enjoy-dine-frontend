import { DEFAULT_SERVER_ERROR_MESSAGE, createSafeActionClient } from "next-safe-action";
import axios from "axios";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const context = await getCloudflareContext({ async: true });

export class ActionError extends Error {}
const API_BASE_URL = context.env.API_BASE_URL || "http://localhost:8000/api/v1";

export const unauthenticatedAction = createSafeActionClient({
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
  return next({ ctx: { api } });
});
