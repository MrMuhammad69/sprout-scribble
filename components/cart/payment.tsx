'use client'
import { useCartStore } from '@/lib/clientStore'
import getStripe from '@/lib/getStripe'
import {Elements} from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import PaymentForm from './PaymentForm'
const stripe = getStripe()
export default function Payment() {
    const { cart } = useCartStore()
    const totalPrice = cart.reduce((acc, item) => {
        return acc + item.price * item.variant.quantity
    }, 0)
    return (
    <motion.div>
        <Elements stripe={stripe} options={{
            mode: 'payment',
            currency: 'usd',
            amount: totalPrice
        }}>
            <PaymentForm totalPrice={totalPrice} />

        </Elements>
    </motion.div>
    )
}