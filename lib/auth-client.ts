import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://memeboard-app.vercel.app",
});
