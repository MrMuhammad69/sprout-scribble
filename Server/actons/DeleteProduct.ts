'use server';
import { z } from 'zod';
import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';
import { db } from '..';

import { products } from '../schema';
import { revalidatePath } from 'next/cache';
import { useAction } from 'next-safe-action/hooks';

const action = createSafeActionClient();
export const deleteProduct = action(z.object({
  id: z.number(),
}), async({id})=> {
  try {
    const data = await db.delete(products).where(eq(products.id, id)).returning();
    revalidatePath('/dashboard/products');
    return {
      success: `Product ${data[0].title} deleted successfully`,
    };
    
   
  } catch (error) {
    return {
      error: 'Failed to delete product',
    };
  }  
});


