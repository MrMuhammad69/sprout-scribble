'use client'

import { useCartStore } from "@/lib/clientStore"
import { Table, TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow } from "../ui/table"
import { useMemo } from "react"
import FormatPrice from "@/lib/formatPrice"
import Image from "next/image"
import { MinusCircle, PlusCircle } from "lucide-react"
import {AnimatePresence, motion} from 'framer-motion'
import Lottie from 'lottie-react'
import emptybox from '@/public/empty-box.json'
import { createId } from "@paralleldrive/cuid2"
export default function CartItems() {
    const {cart, addToCart, removeFromCart} = useCartStore()
    const totalPrice = useMemo(()=> {
        return cart.reduce((acc, item)=>{
            return acc + item.price * item.variant.quantity
        }, 0)
    }, [cart])
    const priceInLetters = useMemo(() => {
        return [...totalPrice.toFixed(2).toString()].map(letter => {
            return {letter, id: createId()}
        })
    },[totalPrice])

    return(
        <motion.div>
            {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                    <motion.div animate={{scale:1, opacity:1}} initial={{scale:0, opacity:0}} transition={{delay:0.3}} >
                    <Lottie animationData={emptybox} className="h-80" loop={true} />
                    <h2 className="text-center text-2xl font-bold text-mutedForeground">Your cart is empty</h2>
                    </motion.div>
                </div>
            )}
            {cart.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell>
                                Product
                            </TableCell>
                            <TableCell>
                                Price
                            </TableCell>
                            <TableCell>
                                Image
                            </TableCell>
                            <TableCell>
                            Quantity
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cart.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    {FormatPrice(item.price)}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <Image width={48} height={48} src={item.image} alt={item.name} priority className="rounded-md"/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                <div className="flex items-center justify-between ">
                      <MinusCircle
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          })
                        }}
                        size={14}
                      />
                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <motion.div className="flex items-center justify-center relative overflow-hidden">
                <span className="text-md">Total: $</span>
                <AnimatePresence mode="popLayout">
                {priceInLetters.map((letter, i) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="text-md inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )

}