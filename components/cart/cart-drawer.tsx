'use client'

import { useCartStore } from "@/lib/clientStore"
import { ShoppingBag } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "../ui/drawer"
import { AnimatePresence, motion } from "framer-motion"
import CartItems from "./CartItems"

export default function CartDrawer() {
    const { cart } = useCartStore()
    return (
        <Drawer modal={false}>
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
                    Cart
                </DrawerHeader>
                <div className="overflow-auto p-4">
                    <CartItems /> 
                </div>
            </DrawerContent>
        </Drawer>
    )
}
