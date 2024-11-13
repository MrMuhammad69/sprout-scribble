'use server';

import { newPasswordSchema } from '@/types/NewPasswordSchema';
import { createSafeActionClient } from 'next-safe-action';
import { getPasswordResetTokenByToken } from './tokens';
import { passwordResetTokens, users } from '../schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { db } from '..';
const action = createSafeActionClient();
export const newPassword = action(newPasswordSchema, async({password, token})=> {
  const pool = new Pool({connectionString: process.env.POSTGRES_URL});
  const dbPool = drizzle(pool);
  if(!token){
    return {
      error: 'Invalid token',
    };
  }
  // CHECK IF THE TOKEN IS EXPIRED
  const existingToken = await getPasswordResetTokenByToken(token);
  if(!existingToken || 'error' in existingToken){
    return {
      error: 'Invalid token',
    };
  }
  // Now TypeScript knows existingToken has the success type with expires property
  if(new Date(existingToken.expires) < new Date()){
    return {
      error: 'Token expired',
    };
  }

  // UPDATE THE PASSWORD
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });
  if(!existingUser){
    return {
      error: 'User not found',
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await dbPool.transaction(async (tx) => {
    if (!existingUser.email) throw new Error('User email not found');
    await tx.update(users).set({password: hashedPassword}).where(eq(users.email, existingUser.email));
    await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
  });

  return {
    success: 'Password Updated Successfully',
  };       

     
});