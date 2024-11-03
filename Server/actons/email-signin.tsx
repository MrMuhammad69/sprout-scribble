'use server';

import { loginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { sendVerificationEmail } from './SendingEmail';
import { generateEmailVerificationToken } from './tokens';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

// Create the action client
const actionClient = createSafeActionClient();

// Export the email sign-in action
export const emailSignIn = actionClient(loginSchema, async ({ email, password }) => {
    try {
        // Check if the user exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        // Return error if user is not found or password is missing
        if (!existingUser || !existingUser.password) {
            return { error: "Invalid credentials" };
        }

        // Check if the user's email is verified
        if (!existingUser.emailVerified) {
            const verificationToken = await generateEmailVerificationToken(email);
            await sendVerificationEmail(email, verificationToken[0].token);
            return { success: "Verification email sent. Please verify your email to proceed." };
        }

        // Attempt to sign in with credentials, without redirect
        const signInResult = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        // Handle sign-in failure by returning an error message without logging to console

        // Successful login response
        return { 
            success: "Logged in successfully",
            url: '/'  // Redirect to home page on successful login
        };

    } catch (error) {
        if (error instanceof AuthError) {
            // Handle specific AuthError types with custom messages
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email or Password Incorrect" };
                case "AccessDenied":
                    return { error: error.message };
                case "OAuthSignInError":
                    return { error: error.message };
                default:
                    return { error: "Something went wrong" };
            }
        }

        // Handle unexpected errors with a generic message
        return { error: "An unexpected error occurred. Please try again later." };
    }
});
