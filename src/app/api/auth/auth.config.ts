import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt"; // For password comparison
import prisma from "@/app/lib/prisma"; // Your Prisma client instance

// Extend the session type to include id and provider
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string; // Make id required
      provider?: string;
      role?: string; // Add role to session
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id: "OTP", // Explicitly set a unique ID
      name: "OTP",
      credentials: {
        phone_number: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const { phone_number, otp } = credentials ?? {};

        if (!phone_number || !otp) {
          throw new Error("Phone number and OTP are required.");
        }

        // Use a static OTP for testing
        const staticOtp = "123456"; // The OTP you want to use for testing purposes

        if (otp !== staticOtp) {
          throw new Error("Invalid OTP.");
        }

        // Simulate user retrieval based on phone number (using Prisma or static data)
        const user = await prisma.users.findUnique({
          where: { phone_number },
        });

        if (!user) {
          throw new Error("No user found with this phone number.");
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      id: "credentials", // Explicitly set a unique ID
      name: "credentials",
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

        console.log("Admin Login Debug:");
        console.log("Received Email:", email);
        console.log("Password Provided:", password ? "Yes" : "No");

        if (!email || !password) {
          console.error("Missing email or password for admin login");
          throw new Error("Email and Password are required.");
        }

        // Admin login check
        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        console.log("Admin Database Lookup:", {
          found: !!admin,
          email: admin?.email,
          hashedPassword: admin?.password ? "Present" : "Not Found",
        });

        if (!admin) {
          console.error(`No admin found with email: ${email}`);
          return null; // Allow fallback to other providers
        }

        try {
          const isValidPassword = await compare(password, admin.password);

          console.log("Password Validation:", {
            isValid: isValidPassword,
            inputPasswordLength: password.length,
            storedPasswordLength: admin.password.length,
          });

          if (!isValidPassword) {
            console.error("Invalid admin password");
            return null;
          }

          return {
            id: admin.id.toString(),
            name: "Admin",
            email: admin.email,
            role: "admin",
          };
        } catch (error) {
          console.error("Admin login error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt", // Use JSON Web Token for session handling
  },

  pages: {
    signIn: "/login", // Custom sign-in page
    error: "/auth/error", // Error page
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const email = user.email;

        if (!email) {
          throw new Error("Email is required for OAuth sign-in");
        }

        // Use sub (Google's unique identifier) to fetch the user record
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
                  provider_id: account.id?.toString() ?? null,
                },
              },
            },
          });
        }

        // Ensure the user object returned has the ID from the database
        user.id = existingUser?.id?.toString() ?? "";
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
        token.role = (user as { role?: string }).role; // Add role to token
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string, // Ensure id is required and set
          name: token.name,
          email: token.email,
          role: token.role as string, // Add role to session
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Secret for signing tokens
};
