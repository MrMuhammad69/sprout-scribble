import * as z from "zod"
export const ProductSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(5,{
        message: "Title must be at least 5 characters long"
    }),
    description: z.string().min(40,{
        message: "Description must be at least 40 characters long"
    }),
    price: z.coerce.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number"
    }).positive({
        message: "Price must be greater than 0"
    }).min(1,{
        message: "Price must be at least 1"
    })
})