import Products from "@/components/products/products";
import { Button } from "@/components/ui/button";
import { db } from "@/Server";
import { productVariants } from "@/Server/schema";

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with:{
      variantImages:true,
      variantTags: true,
      product:true
    },
    orderBy:(productVariants, {desc})=>[desc(productVariants.id)]
  })
  return (
   <main>
      <Products variants={data}/>
    </main>
  )
}
