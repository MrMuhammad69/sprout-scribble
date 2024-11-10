'use client'

import { useCartStore } from "@/lib/clientStore"
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "../ui/button"
import { useState } from "react"
import { CreatePaymentIntent } from "@/Server/actons/createPaymentInstance"
import { title } from "process"

export default function PaymentForm({totalPrice}:{totalPrice:number}){
    const stripe = useStripe()
    const elements = useElements()
    const {cart} = useCartStore()
    const [loading, setisloading] = useState(false)
    const [errorMessage, setErrorMessage]= useState('')
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault()
        setisloading(true)
        if(!stripe|| !elements){
            setisloading(false)
            return
        }  
        const {error:SubmitError} = await elements.submit()
        if(SubmitError){
            setErrorMessage(SubmitError.message || 'Error in processing the payment')
            setisloading(false)
            return
        }
        const {data}  = await CreatePaymentIntent({
            amount: totalPrice,
            currency: 'usd',
            cart: cart.map((item)=> ({
                quantity: item.variant.quantity,
                price: item.price,
                productID: item.id,
                title: item.name,
                image: item.image
            }))
        })
        if(data?.error){
            setErrorMessage(data.error)
            setisloading(false)
            return
        }
        if(data?.success){
            const {error} = await stripe.confirmPayment({
                elements,
                clientSecret: data.success.clientSecretID!,
                redirect: 'if_required',
               confirmParams: {
                return_url: `http://localhost:3000/success`,
                receipt_email: data.success.user as string
               }
            })
            if(error){
              setErrorMessage(error.message || 'Error in processing the payment') 
              setisloading(false)
              return
            } else {
                setisloading(false)
                console.log("save the order")
            }
        }

    }
    return(
        <form onSubmit={handleSubmit}>
            <PaymentElement/>
            <AddressElement options={{mode: 'shipping'}} />
            <Button disabled={!stripe || !elements}>
                <span className="mt-2">
                    Pay now
                </span>
            </Button>

        </form>
    )
}