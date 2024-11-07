'use client'

import { ProductSchema } from "@/types/ProductSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { DollarSign } from "lucide-react"
import Tiptap from "./tipTap"
import { createProduct } from "@/Server/actons/CreateProduct"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProductForm() {
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
        mode: "onChange"
    })
    const router = useRouter()
    const { execute, status } = useAction(createProduct, {
        onSuccess: (data) => {
            if (data?.success) {
                console.log("Success:", data.success); // Debugging
                router.push("/dashboard/products")
                toast.success(data.success)
            }
            if (data?.error) {
                console.log("Error:", data.error); // Debugging
                toast.error(data.error)
            }
        },
        onError: (error) => {
            console.log("Error:", error); // Debugging
            toast.error(error.fetchError || 'An error occurred')
        },
        onExecute: () => {
            console.log("Executing..."); // Debugging
            toast.loading('Creating product...')
        },
        onSettled: () => {
            toast.dismiss()
        }
    })
    const onSubmit = (values: z.infer<typeof ProductSchema>) => {
        execute(values)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Product</CardTitle>
                <CardDescription>Add a new product to the store</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title of your Product" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price of the Product</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={32} className="p-2 rounded-md bg-violet-100" />
                                            <Input
                                                type="number"
                                                placeholder="Product price"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty} type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}