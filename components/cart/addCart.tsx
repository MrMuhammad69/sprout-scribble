'use client'

import { useCartStore } from "@/lib/clientStore"
import { useState } from "react"
import { Button } from "../ui/button"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { redirect, useSearchParams } from "next/navigation"
export default function AddCart() {
    const { addToCart } = useCartStore()
    const [quantity, setQuantity] = useState(1)
    const params = useSearchParams()
    const id = Number(params.get('id'))
    const productID = Number(params.get('productID'))
    const title = params.get('title')
    const type = params.get('type')
    const price = Number(params.get('price'))
    const image = params.get('image')
    if(!id || !productID || !title || !type || !price || !image) {
        toast.error(    
            'Something went wrong')
        return redirect('/')}
    return(
        <>
        <div className="flex items-center gap-4 justify-stretch my-4">
        <Button variant={'secondary'} className="text-primary" onClick={()=>{
            if(quantity > 1) setQuantity(quantity - 1)
        }}>
                <Minus size={16} strokeWidth={3}/>
            </Button>
            <Button className="flex-1">
                Quantity: {quantity}
            </Button>
            <Button variant={'secondary'} className="text-primary" onClick={()=> setQuantity(quantity + 1)}>
                <Plus size={16} strokeWidth={3}/>
            </Button>
        </div>
        <Button onClick={()=>{
            toast.success(`Added ${title} ${type} to  your cart`)
            addToCart({id:productID, variant:{
                variantID:id,
                quantity:quantity,
            }, price:price, name: title + ' ' + type, image:image })
        }}>
            Add to Cart
        </Button>
        </>
    )
}