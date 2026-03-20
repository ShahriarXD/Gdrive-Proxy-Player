import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";

import { getRequiredEnv } from "@/lib/env";

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
};

async function refreshGoogleAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: getRequiredEnv("GOOGLE_CLIENT_ID"),
        client_secret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const tokens = (await response.json()) as GoogleTokenResponse & {
      error?: string;
      error_description?: string;
    };

    if (!response.ok) {
      throw new Error(tokens.error_description ?? "Unable to refresh access token.");
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
      refreshToken: tokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to refresh Google access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const scopes = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");

export const authConfig = {
  trustHost: true,
  secret: getRequiredEnv("NEXTAUTH_SECRET"),
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: scopes,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token ?? token.refreshToken,
        };
      }

      if (token.expiresAt && Date.now() < token.expiresAt * 1000 - 60_000) {
        return token;
      }

      return refreshGoogleAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
