'use server'

import { VariantSchema } from "@/types/VariantSchema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { productVariants, variantImages, variantTags } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
const action = createSafeActionClient()

export const CreateVariant = action(
  VariantSchema,
  async ({
    color,
    editMode,
    id,
    productID,
    productType,
    tags,
    variantImages: newImages,
  }: z.infer<typeof VariantSchema>) => { // Adding types for the action parameters
    try {
      if (editMode && id) {
        // Update the existing variant
        const editVariant = await db
          .update(productVariants)
          .set({
            color,
            productType,
            updated: new Date(),
          })
          .where(eq(productVariants.id, id))
          .returning()

        if (editVariant.length === 0) {
          throw new Error("Variant not found")
        }

        // Delete and insert updated tags
        await db.delete(variantTags).where(eq(variantTags.variantID, editVariant[0].id))
        await db.insert(variantTags).values(
          tags.map((tag: string) => ({
            tag,
            variantID: editVariant[0].id,
          }))
        )

        // Delete and insert updated images
        await db.delete(variantImages).where(eq(variantImages.variantID, editVariant[0].id))
        await db.insert(variantImages).values(
          newImages.map((img: { name: string; size: number; url: string }, idx: number) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: editVariant[0].id,
            order: idx,
          }))
        )

        revalidatePath("/dashboard/products")
        return { success: `Edited Variant ${productType}` }

      } else if (!editMode && productID) {
        // Insert a new variant
        const newVariant = await db
          .insert(productVariants)
          .values({
            color,
            productType,
            productID,
          })
          .returning()

        if (newVariant.length === 0) {
          throw new Error("Failed to create new variant")
        }

        // Insert tags and images for the new variant
        await db.insert(variantTags).values(
          tags.map((tag: string) => ({
            tag,
            variantID: newVariant[0].id,
          }))
        )

        await db.insert(variantImages).values(
          newImages.map((img: { name: string; size: number; url: string }, idx: number) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: newVariant[0].id,
            order: idx,
          }))
        )

        revalidatePath("/dashboard/products")
        return { success: `Created new Variant ${productType}` }

      } else {
        return {
          error: "Invalid variant data",
        }
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }
    }
  }
)
