import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/Server";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import Credentials from "@auth/core/providers/credentials";
import { loginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";
import bcrypt from "bcrypt";

export const authConfig = {
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        // Always fetch fresh user data from the database
        const currentUser = await db.query.users.findFirst({
          where: eq(users.id, token.sub)
        });

        if (currentUser) {
          session.user = {
            ...session.user,
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image,
            role: currentUser.role,
            twoFactorEnabled: currentUser.twoFactorEnabled,
            isOAuth: token.isOAuth,
          };
        }
      }
      return session;
    },
    async jwt({ token }) {
      if(!token.sub) return token;
      
      // Always fetch fresh user data
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub)
      });
      
      if(!existingUser) return token;
      
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id)
      });

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.twoFactorEnabled = existingUser.twoFactorEnabled;
      token.image = existingUser.image;
      
      return token;
    },
    async signIn({ user, account, profile, email }) {
      if (!user.email) return false;

      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email)
        });

        // If user exists but used different provider
        if (existingUser && !existingUser.emailVerified) {
          // Update the user's email verification status
          await db.update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.email, user.email));
          return true;
        }

        // If no existing user, allow sign up
        if (!existingUser) {
          return true;
        }
      }
      
      return true;
    }
  },
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
    github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ]
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
