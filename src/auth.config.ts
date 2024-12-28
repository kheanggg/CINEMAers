// auth.config.ts
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/app/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          throw new Error("Email and Password are required.");
        }

        const user = await prisma.users.findUnique({
          where: { email },
          include: { auth_providers: true },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        const authProvider = user.auth_providers.find(
          (provider) => provider.provider === "credentials"
        );

        if (!authProvider || !authProvider.password) {
          throw new Error("No password found for this user.");
        }

        const isValid = await compare(password, authProvider.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const email = user.email;

        if (!email) {
          throw new Error("Email is required for OAuth sign-in.");
        }

        const existingUser = await prisma.users.findUnique({
          where: { email },
        });

        if (!existingUser) {
          await prisma.users.create({
            data: {
              email: email,
              name: user.name ?? "",
              username: email.split("@")[0],
              auth_providers: {
                create: {
                  provider: account.provider,
                  provider_id:
                    typeof account.id === "string"
                      ? account.id
                      : account.id?.toString() ?? null,
                },
              },
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};