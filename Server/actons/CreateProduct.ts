'use server';

import { ProductSchema } from '@/types/ProductSchema';
import {createSafeActionClient} from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { products } from '../schema';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const createProduct = action(ProductSchema, async({description, price,title, id})=> {
  try {
    if(id){
      const currentProduct = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if(!currentProduct) return {error: 'Product not found'};
      const editedProduct = await db.update(products).set({
        description,
        price,
        title,
      }).where(eq(products.id, id)).returning();
      revalidatePath('/dashboard/products');
      return {success: `Product ${editedProduct[0].title} updated`};
    }
    if(!id){
      const newProduct = await db.insert(products).values({
        description,
        price,
        title,
      }).returning();
      return {success: `Product ${newProduct[0].title} created`};
    }
  } catch (error) {
    return {error: 'Something went wrong'};
        
  }
});