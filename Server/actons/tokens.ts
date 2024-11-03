'use server'

import { eq } from "drizzle-orm"
import { db } from ".."
import { emailTokens, passwordResetTokens, users } from "../schema"

export const getVerificationTokenByEmail = async (email: string) => {
    const verificationToken = await db.query.emailTokens.findFirst({
        where: eq(emailTokens.token, email)
    })
    return verificationToken
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() +3600 * 10000)
    
    const existingToken = await getVerificationTokenByEmail(email)
    if(existingToken){
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    }

    const verificationToken = await db.insert(emailTokens).values({ token, expires, email}).returning()
    return verificationToken
}

export const getVerificationTokenByToken = async (token: string) => {
    const verificationToken = await db.query.emailTokens.findFirst({
        where: eq(emailTokens.token, token)
    })
    return verificationToken
}

export const VerfiyEmailToken = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)
    if (!existingToken) return {error: 'Token not found'}
    if (existingToken.expires < new Date()) return {error: 'Token has expired'}
    const existUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    if (!existUser) return {error: 'Email does not exist'}
    await db.update(users).set({ emailVerified: new Date() }).where(eq(users.email, existingToken.email))

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    return {
        success: 'Email verified successfully'
    }
}

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.token, token)
        })
        return passwordResetToken
    } catch (error) {
        return {error: 'No token found'} 
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.email, email)
    })
    return passwordResetToken
}

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() +3600 * 10000)

    const existingToken = await getPasswordResetTokenByEmail(email)
    if(existingToken){
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    }

    const passwordResetToken = await db.insert(passwordResetTokens)
        .values({token, expires, email})
        .returning()

    return passwordResetToken
}

export const verifyPasswordResetToken = async (token: string) => {
    const existingToken = await getPasswordResetTokenByToken(token)
    if (!existingToken || 'error' in existingToken) {
        return { error: "Token not found" }
    }
    
    if (existingToken.expires < new Date()) {
        return { error: "Token has expired" }
    }
    
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    
    if (!existingUser) {
        return { error: "User not found" }
    }
    
    return { success: "Token valid", email: existingToken.email }
}
