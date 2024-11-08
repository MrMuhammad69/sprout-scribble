'use server'

import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import * as z from "zod"
import { productVariants } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
const action = createSafeActionClient()
export const deleteVariant = action(z.object({
    id: z.number()
}), async({id})=> {
    // delete variant logic here
    try {
        const variant = await db.delete(productVariants).where(eq(productVariants.id, id)).returning()
    revalidatePath('/dashboard/products')
    return {
        success: 'Variant Deleted Successfully'
    }
    } catch (error) {
        return {
            error: 'Failed to deleteVariant'
        }
    }
})