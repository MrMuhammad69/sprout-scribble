import { db } from "@/Server"
import placeholder from '@/public/placeholder_small.jpg'
import { DataTable } from "./DataTable"
import { columns } from "./columns"


export default async function Products(){
    const products = await db.query.products.findMany({
        orderBy: (products, {desc}) => [desc(products.id)]
    })
    if(!products) throw new Error("No products found")
    const dataTable = products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        variants: [],
        image: placeholder.src
    }))
    if (!dataTable) throw new Error("No data table found")
    return(
        <div className="">
            <DataTable columns={columns} data={dataTable} />
           
        </div>
    )
}