import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db('zyvora');

export const auth = betterAuth({
    // The public URL of this Next.js app — needed for cookies & CSRF in production
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

    // Must match BETTER_AUTH_SECRET on the backend if sharing the same DB
    secret: process.env.BETTER_AUTH_SECRET,

    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        'http://localhost:3000',
        process.env.NEXT_PUBLIC_BASE_URL,
    ].filter(Boolean) as string[],
    user: {
        additionalFields: {
            role: { type: "string", required: true, defaultValue: "learner" },
            avatar: { type: "string", required: false },
            bio: { type: "string", required: false },
        }
    },
});