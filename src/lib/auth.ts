import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { db } from "../db";
import * as schema from "../db/schema";
import * as dotenv from 'dotenv';
dotenv.config();

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
            passkey: schema.passkey
        }
    }),
    emailAndPassword: {
        enabled: true, // Needed for initial fallback/bootstrap
    },
    plugins: [
        passkey()
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user"
            },
            requiresPasswordReset: {
                type: "boolean",
                defaultValue: false
            },
            handle: {
                type: "string",
            },
            specialty: {
                type: "string",
            },
            dateStarted: {
                type: "string",
            },
            bio: {
                type: "string",
            }
        }
    },
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-development",
    // baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4321", // Infer from request
    advanced: {
        trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') || [],
        trustProxy: true
    }
});
