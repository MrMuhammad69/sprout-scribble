'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { VariantsWithImagesTags } from "@/lib/inferType"
import { VariantSchema } from "@/types/VariantSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'

export default function ProductVariant({editMode, productID, variant, children}: {
    editMode: boolean, productID: number, variant?: VariantsWithImagesTags, children: React.ReactNode
}){
    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            tags:[],
            variantImages: [],
            color:'#000000',
            editMode,
            id: undefined,
            productID: undefined,
            productType: "Black Notebook"
        },
        mode: "onChange"
    })

    function onSubmit(values: z.infer<typeof VariantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
    return(
        <Dialog>
  <DialogTrigger>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{editMode? 'Edit': 'Create'} your variant</DialogTitle>
      <DialogDescription>
        Manage Your Variants
      </DialogDescription>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Title</FormLabel>
              <FormControl>
                <Input placeholder="Pick a title for your Product." {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  </DialogContent>
</Dialog>

    )
}