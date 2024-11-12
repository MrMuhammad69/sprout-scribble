import ProductTags from "@/components/navigation/ProductTags";
import Algolia from "@/components/products/algolia";
import Products from "@/components/products/products";
import { Button } from "@/components/ui/button";
import { db } from "@/Server";
import { productVariants } from "@/Server/schema";
import algoliasearch from "algoliasearch";

export const revalidate = 60 * 60
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
    <Algolia />
    <ProductTags />
      <Products variants={data}/>
    </main>
  )
}
