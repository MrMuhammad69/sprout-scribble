'use server'

import { resetSchema } from "@/types/resetSchema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { users } from "../schema"
import { eq } from "drizzle-orm"
import { generatePasswordResetToken } from "./tokens"
import { sendPasswordResetEmail } from "./SendingEmail"


const action = createSafeActionClient()
export const passwordReset = action(resetSchema, async({email})=> {
    try {
        console.log('Attempting password reset for:', email);
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if(!existingUser){
            console.log('User not found:', email);
            return {
                error: "User not found"
            }
        }
        
        const passwordResetTokens = await generatePasswordResetToken(email)
        if(!passwordResetTokens || !passwordResetTokens.length) {
            console.log('Failed to generate token');
            return {
                error: "Failed to generate reset token"
            }
        }

        const resetToken = passwordResetTokens[0]
        await sendPasswordResetEmail(resetToken.email, resetToken.token)
        
        return {
            success: "Password reset email sent"
        }
    } catch (error) {
        console.error('Password reset error:', error);
        return {
            error: "Something went wrong during password reset"
        }
    }
})
