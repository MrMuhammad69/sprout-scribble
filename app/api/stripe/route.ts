import { db } from "@/Server"
import { orders } from "@/Server/schema"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-10-28.acacia",
  })
  const sig = req.headers.get("stripe-signature") || ""
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

  const reqText = await req.text()
  const reqBuffer = Buffer.from(reqText)

  let event

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    })
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log('case entered')
      const retrieveOrder = await stripe.paymentIntents.retrieve(
        event.data.object.id,
        { expand: ["latest_charge"] }
      )
      console.log('no problem with charge')
      const charge = retrieveOrder.latest_charge as Stripe.Charge

      // Introduce a delay before updating the database
      await new Promise(resolve => setTimeout(resolve, 1000)) // 10-second delay

      await db
        .update(orders)
        .set({
          status: "succeeded",
          receiptURL: charge.receipt_url,
        })
        .where(eq(orders.paymentIntentID, event.data.object.id))
        .returning()
      console.log('updated order')
      console.log(event.data.object.id)
      break

    default:
      console.log('hello', `${event.type}`)
  }

  return new Response("ok", { status: 200 })
}
