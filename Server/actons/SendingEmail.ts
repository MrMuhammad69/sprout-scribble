'use server'

import baseUrl from '@/lib/baseUrl'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

const domain = baseUrl()

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const {data, error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: 'ibneabdullatifjud@gmail.com',
        subject: "Sprout and Scribble - Confirmation Email",
        html: `<p>Please confirm your email by clicking the link below:</p><p><a href="${confirmLink}">${confirmLink}</a></p>`
    })
    if(error) throw new Error(error.message)
    if(data) return {
        success: "Verification email sent"
    } 
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`
    const {data, error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: 'ibneabdullatifjud@gmail.com',
        subject: "Sprout and Scribble - Password Reset Email",
        html: `<p>Reset your password:</p><p><a href="${confirmLink}">${confirmLink}</a></p>`
    })
    if(error) return {error: error.message}
    if(data) return {
        success: "Password reset email sent"
    }

}

