'use client'

import { VariantsWithProduct } from "@/lib/inferType"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import FormatPrice from "@/lib/formatPrice"

type ProductTypes = {
    variants: VariantsWithProduct[]
}
const Products = ({variants}:ProductTypes) => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
       {variants.map((variant) => (
          <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}>
            <Image src={variant.variantImages[0].url} alt={variant.product.title} width={720} height={480}
            loading="lazy"/>
            <div className="flex justify-between">
                <div className="font-medium">
                    <h2>
                        {variant.product.title}
                    </h2>
                    <p className="text-sm text-mutedForeground">
                        {variant.productType}
                    </p>
                </div>
                <div>
                    <Badge variant="secondary">
                        {FormatPrice(variant.product.price)}
                    </Badge>
                </div>

            </div>
          </Link>
       ))}
    </main>
  )
}

export default Products