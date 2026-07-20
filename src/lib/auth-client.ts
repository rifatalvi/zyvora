import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

// Extract base URL from NEXT_PUBLIC_API_URL (remove /api suffix if present)
// Fallback to localhost so the app doesn't crash if the env var is missing
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
const baseUrl = apiUrl.replace(/\/api$/, '');

export const authClient = createAuthClient({
  baseURL: baseUrl,
  plugins: [
    // This tells the client to include & parse our custom user fields (role, avatar, bio)
    // from the session response — without this, custom fields are silently dropped.
    inferAdditionalFields({
      user: {
        role: { type: 'string' },
        avatar: { type: 'string' },
        bio: { type: 'string' },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
