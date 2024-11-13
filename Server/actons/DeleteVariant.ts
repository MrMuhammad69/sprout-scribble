'use server';

import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import * as z from 'zod';
import { productVariants } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import algoliasearch from 'algoliasearch';
const action = createSafeActionClient();
const client = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!,
);
const algoliaIndex = client.initIndex('PRODUCTS');
export const deleteVariant = action(z.object({
  id: z.number(),
}), async({id})=> {
  // delete variant logic here
  try {
    const deletedVariant = await db.delete(productVariants).where(eq(productVariants.id, id)).returning();
    algoliaIndex.deleteObject(id.toString());
    revalidatePath('/dashboard/products');
    return {
      success: 'Variant Deleted Successfully',
    };
  } catch (error) {
    return {
      error: 'Failed to deleteVariant',
    };
  }
});