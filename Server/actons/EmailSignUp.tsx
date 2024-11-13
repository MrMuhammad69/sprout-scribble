'use server';

import { RegisterSchema } from '@/types/RegisterSchema';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';
import { db } from '..';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './SendingEmail';
const action = createSafeActionClient();

export const emailRegister = action(RegisterSchema, async ({email, password, name})=> {
    
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  // Check if email is already in use in the database then say it's in use , it's already taken 
  if(existingUser){
    if(!existingUser.emailVerified){
      const verificationToken = await generateEmailVerificationToken(email);
      await sendVerificationEmail(email, verificationToken[0].token);

      return {
        success: 'Verification email Resent',
      };
    }
    return {
      error: 'Email is already in use',
    };
  }

  // logic for if the user does not exist in our database
  await db.insert(users).values({email, password: hashedPassword, name});

  const verificationToken = await generateEmailVerificationToken(email);
  await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);

  return {
    success: 'Verification email sent',
  };
});