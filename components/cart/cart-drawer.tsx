'use client';

import { useCartStore } from '@/lib/clientStore';
import { ShoppingBag } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer';
import { AnimatePresence, motion } from 'framer-motion';
import CartItems from './CartItems';
import CartMessage from './cartMessages';
import Payment from './payment';
import OrderConfirmed from './OrderConfirmed';
import CartProgress from './cartProgress';

export default function CartDrawer() {
  const { cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } = useCartStore();
  return (
    <Drawer modal={false} open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div 
                animate={{ scale: 1, opacity: 1 }} 
                initial={{ scale: 0, opacity: 0 }} 
                exit={{ scale: 0, opacity: 0 }} 
                className="absolute justify-center -top-1 -right-0.5 items-center dark:bg-primary bg-primary/50 w-4 h-4 text-xs font-bold rounded-full text-white"
              >
                {cart.length}
              </motion.div>
            )}
          </AnimatePresence>
          <ShoppingBag size={30}/>
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh]">
        <DrawerHeader className="flex justify-center text-center font-semibold">
          <CartMessage/>
        </DrawerHeader>
        <CartProgress />
        <div className="overflow-auto p-4">
          {checkoutProgress === 'cart-page' && <CartItems />}
          {checkoutProgress === 'payment-page' && <Payment />}
          {checkoutProgress === 'confirmation-page' && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
