import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // Better Auth's own server URL (no /api suffix — that's for our custom routes)
  baseURL: 'http://localhost:5000',
});

export const { useSession, signIn, signUp, signOut } = authClient;
