import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  $InferAuth: {
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [jwtClient()],
});
export const { signIn, signUp, useSession } = createAuthClient();
