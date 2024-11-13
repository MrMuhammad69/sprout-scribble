'use server';

import { loginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { accounts, TwoFactorTokens, users } from '../schema';
import { sendTwoFactorEmail, sendVerificationEmail } from './SendingEmail';
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from './tokens';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

// Create the action client
const actionClient = createSafeActionClient();

// Export the email sign-in action
export const emailSignIn = actionClient(loginSchema, async ({ email, password, code }) => {
  try {
    // Check if the user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Return error if user is not found
    if (!existingUser) {
      return { error: 'Email not found' };
    }

    // Check if this is an OAuth account (optional: provide OAuth-specific error message)
    const oauthAccount = await db.query.accounts.findFirst({
      where: eq(accounts.userId, existingUser.id),
    });

    if (oauthAccount) {
      return { 
        error: `This email is associated with a ${oauthAccount.provider} account. Please sign in with ${oauthAccount.provider}.`,
      };
    }

    // Check if the user's email is verified
    if (!existingUser.emailVerified) {
      const verificationToken = await generateEmailVerificationToken(existingUser.email);
      await sendVerificationEmail(
        verificationToken[0].email, 
        verificationToken[0].token,
      );
      return { success: 'Verification email sent. Please verify your email to proceed.' };
    }

    // Two-factor authentication flow
    if (existingUser.twoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
                
        // Validate 2FA token
        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: 'Invalid code' };
        }
                
        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) {
          return { error: 'Code has expired' };
        }
                
        // Clean up used token
        await db.delete(TwoFactorTokens).where(eq(TwoFactorTokens.id, twoFactorToken.id));
                
        try {
          // Attempt to sign in with credentials after 2FA verification
          await signIn('credentials', {
            email,
            password,
            redirect: false,
          });
                    
          return { success: 'Logged in successfully', url: '/' };
        } catch (error) {
          return { error: 'Invalid credentials' };
        }
      } else {
        // Verify password before generating 2FA token
        if (!existingUser.password) {
          return { error: 'Invalid credentials' };
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
          return { error: 'Invalid credentials' };
        }

        // Only generate and send 2FA token if password is valid
        const token = await generateTwoFactorToken(existingUser.email);
        if (!token || token.length === 0) {
          return { error: 'Failed to generate two-factor token' };
        }
                
        await sendTwoFactorEmail(token[0].email, token[0].token);
        return { twoFactor: 'Two-factor email sent' };
      }
    }

    // Attempt to sign in with credentials
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: 'Logged in successfully', url: '/' };

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
      case 'CredentialsSignin':
        return { error: 'Email or Password Incorrect' };
      case 'AccessDenied':
        return { error: error.message };
      case 'OAuthSignInError':
        return { error: error.message };
      default:
        return { error: 'Something went wrong' };
      }
    }
    // Handle unexpected errors with a generic message
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
});
