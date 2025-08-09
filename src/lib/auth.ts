// @ts-nocheck
import NextAuth, { User, NextAuthResult } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { googleLoginAction, loginAction } from "@/actions/accounts";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const context = await getCloudflareContext({ async: true });

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: context.env.GOOGLE_CLIENT_ID || "",
      clientSecret: context.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Please provide valid credentials");
        try {
          const result = await loginAction({
            email: credentials?.email,
            password: credentials?.password,
          });

          if (result?.data) {
            return {
              access: result.data.access,
              refresh: result.data.refresh,
              user: {
                id: result.data.user.pk.toString(),
                email: result.data.user.email,
                firstName: result.data.user.firstName,
                lastName: result.data.user.lastName,
              },
            } as User;
          }
          throw new Error("Invalid credentials");
        } catch (error) {
          throw new Error("Something went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
      trigger,
      session,
    }: {
      token: any;
      user?: any;
      account?: any;
      trigger?: any;
      session?: any;
    }) {
      if (trigger === "update" && session.lichess) {
        token.lichess = session.lichess;
        return token;
      }
      if (user) {
        if (account.provider === "google") {
          try {
            const response = await googleLoginAction({
              accessToken: account?.access_token,
              idToken: account?.id_token,
            });
            token = {
              ...token,
              access: response?.data?.access,
              refresh: response?.data?.refresh,
              user: {
                id: response?.data?.user?.pk.toString(),
                email: response?.data?.user?.email,
                firstName: response?.data?.user?.firstName,
                lastName: response?.data?.user?.lastName,
              },
            };

            return token;
          } catch (error) {
            return token;
          }
        } else if (account.provider === "lichess") {
          const currentSession = await auth();
          token = {
            ...currentSession,
            lichess: {
              access: account?.access_token,
              username: account?.providerAccountId,
            },
          };
          return token;
        }
        token = {
          ...token,
          access: user.access,
          refresh: user.refresh,
          user: { ...user.user },
        };
        return token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session = {
          ...session,
          access: token.access,
          refresh: token.refresh,
          user: { ...token.user },
        };
      }
      return session;
    },
  },
  secret: context.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
};

const result = NextAuth(authOptions);

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
