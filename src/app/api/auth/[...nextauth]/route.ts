import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt"; // For password comparison
import prisma from "@/app/lib/prisma"; // Your Prisma client instance

// Extend the session type to include `id` and `provider`
// declare module "next-auth" {
//   interface Session {
//     user: {
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       id?: string; // Add the `id` field
//       provider?: string; // Add the `provider` field
//     };
//   }
// }

export const authOptions: AuthOptions = {
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // Credentials Provider (Email/Password)
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

        // Query the database for the user by email
        const user = await prisma.users.findUnique({
          where: { email },
          include: { auth_providers: true }, // Include related auth providers
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // Find the credentials-based login for the user
        const authProvider = user.auth_providers.find(
          (provider) => provider.provider === "credentials"
        );

        if (!authProvider || !authProvider.password) {
          throw new Error("No password found for this user.");
        }

        // Validate the password
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
    strategy: "jwt", // Use JSON Web Token for session handling
  },

  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error", // Error page
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const email = user.email;

        if (!email) {
          throw new Error("Email is required for OAuth sign-in");
        }
        // If the user is signing in with Google, check if they already exist in the database
        const existingUser = await prisma.users.findUnique({
          where: { email },
        });

        // If the user doesn't exist, create a new user record
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

  secret: process.env.NEXTAUTH_SECRET, // Secret for signing tokens
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
