'use server'

import { reviewSchema } from "@/types/ReviewSchema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { and, eq } from "drizzle-orm"
import { reviews } from "../schema"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()


export const addReview = action(reviewSchema, async ({
    productID,
    rating,
    comment
}) => {
    try {
        const session = await auth()
        if(!session) return{error: 
            'Login to add review'
        }
        const reviewExists = await db.query.reviews.findFirst({
            where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id))
        })
        if(reviewExists) return {error: "You have already reviewed this product"}
        const newReview = await db.insert(reviews).values({
            userID: session.user.id,
            productID,
            rating,
            comment
        }).returning()
        revalidatePath(`/products/${productID}`)
        return {success: `Reviewed product ${newReview[0]}`}

        
    } catch (error) {
        return {error: JSON.stringify(error)}
    }

})