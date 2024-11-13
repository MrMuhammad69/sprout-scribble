'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useCartStore } from '@/lib/clientStore';
import { motion } from 'framer-motion';
import orderConfirmed from '@/public/order-confirmed.json';
import Lottie from 'lottie-react';
export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">Thank You for your purchase</h2>
      <Link href="/dashboard/orders">
        <Button onClick={()=> {
          setCheckoutProgress('cart-page');
          setCartOpen(false);
        }}>
                View your Orders
        </Button>
      </Link>
      <motion.div  animate={{scale:1, opacity:1}} initial={{scale:0, opacity:0}} className="flex flex-col items-center justify-center gap-4 text-center">
        <Lottie className="h-56 my-4" animationData={orderConfirmed}/>
      </motion.div>
    </div>
  );
}