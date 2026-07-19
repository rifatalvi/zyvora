import { createAuthClient } from 'better-auth/react';

// Extract base URL from NEXT_PUBLIC_API_URL (remove /api if it exists)
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const baseUrl = apiUrl.replace(/\/api$/, '');

export const authClient = createAuthClient({
  baseURL: baseUrl,
});

export const { useSession, signIn, signUp, signOut } = authClient;
