'use client';

import { useCartStore } from '@/lib/clientStore';
import { motion } from 'framer-motion';
import { DrawerDescription, DrawerTitle } from '../ui/drawer';
import { ArrowLeft } from 'lucide-react';
export default function CartMessage(){
  const {checkoutProgress, setCheckoutProgress} = useCartStore();
  return(
    <motion.div animate={{scale:1, opacity:1}} initial={{scale:0, opacity:0}} className="flex flex-col items-center justify-center gap-4 text-center">
      <DrawerTitle>
        {checkoutProgress === 'cart-page' && ' You cart Items'}
        {checkoutProgress === 'payment-page' && 'Choose a payment method'}
        {checkoutProgress === 'confirmation-page' && 'Order Confirmed'}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkoutProgress === 'cart-page' && ' View and Edit your Bag'}
        {checkoutProgress === 'payment-page' && <span className="flex items-center justify-center cursor-pointer hover:text-primary" onClick={() => setCheckoutProgress('cart-page')}>
          <ArrowLeft /> Head Back to cart </span>}
        {checkoutProgress === 'confirmation-page' && 'You will receive an email with your receipt.'}
      </DrawerDescription>

    </motion.div>
  );
}