'use client'

import { ColumnDef, Row } from "@tanstack/react-table"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { deleteProduct } from "@/Server/actons/DeleteProduct"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import Link from "next/link"
import { VariantsWithImagesTags } from "@/lib/inferType"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ProductVariant from "./ProductVariant"


type Product = { 
    id: number
    title: string
    description: string
    price: number
    variants: VariantsWithImagesTags[]
    image: string
}

const ActionCell = ({ row }: { row: Row<Product> }) => {
  const { status, execute } = useAction(deleteProduct, {
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        toast.success(data.success)
      }
    },
    onExecute: () => {
      toast.loading("Deleting Product")
    },
    onSettled: () => {
      toast.dismiss()
    }
  })
  const product = row.original

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Product>[] = [

  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "title",
    header: "Title"
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[]
      return (
        <div className="flex gap-2">
          {variants.map((variant) => (
            <div key={variant.id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      productID={variant.productID}
                      variant={variant}
                      editMode={true}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        key={variant.id}
                        style={{ background: variant.color }}
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant.productType}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <ProductVariant productID={row.original.id} editMode={false}>
                    <PlusCircle className="h-5 w-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new product variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
     header: "Price",
     cell: ({row}) => {
        const price = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price)
        return (<div className="font-medium text-sm">
            {formatted}
        </div>)
     }
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({row}) => {
        const cellImage = row.getValue("image") as string
        const cellTitle = row.getValue("title") as string
        return <Image src={cellImage} alt={cellTitle} width={50} height={50} className="rounded-md" />
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionCell
  }

]