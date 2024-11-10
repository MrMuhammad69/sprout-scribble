'use server'

import { paymentIntentSchema } from "@/types/PaymentIntent"
import { createSafeActionClient} from "next-safe-action"
import Stripe from 'stripe'
import { auth } from "../auth"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const action = createSafeActionClient()
export const CreatePaymentIntent  = action(paymentIntentSchema, async ({amount, cart, currency}) => {
    const user = await auth()
    if(!user) return {error: "Please Login to continue"}
    if(!amount ) return {error: "No product to checkout"}

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            userID: user.user.id,
            cart: JSON.stringify(cart)
        }
        
    })
    return {
        success: {
          paymentIntentID: paymentIntent.id,
          clientSecretID: paymentIntent.client_secret,
          user: user.user.email,
        },
      }

})