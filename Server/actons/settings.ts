'use server';

import { SettingsSchema } from '@/types/settingsSechema';
import { createSafeActionClient } from 'next-safe-action';
import { auth } from '../auth';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const setting = action(SettingsSchema, async (data) => {
  try {
    const user = await auth();
    if(!user) return {error: 'Unauthorized'};
        
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });
    if(!dbUser) return {error: 'User not found'};

    const updateData: any = {
      name: data.name || dbUser.name,
      image: data.image || dbUser.image,
      twoFactorEnabled: data.twoFactorEnabled ?? dbUser.twoFactorEnabled,
    };

    if(!user.user.isOAuth && data.password && data.newPassword) {
      if(!dbUser.password) return {error: 'Cannot update password'};
            
      const passwordsMatch = await bcrypt.compare(data.password, dbUser.password);
      if(!passwordsMatch) return {error: 'Invalid password'};
            
      const salt = await bcrypt.genSalt(10);
      const samePassword = await bcrypt.compare(data.newPassword, dbUser.password);
      if(samePassword) return {error: 'New password cannot be the same as the old password'};
            
      const hashedPassword = await bcrypt.hash(data.newPassword, salt);
      updateData.password = hashedPassword;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, dbUser.id));

    revalidatePath('/dashboard/settings');
    revalidatePath('/', 'layout');
        
    return {success: 'Profile updated successfully', redirect: true};
  } catch (error) {
    console.error('Settings update error:', error);
    return {error: 'Failed to update settings'};
  }
});


