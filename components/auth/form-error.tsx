import { AlertCircle } from "lucide-react"



export const FormError = ({message}: {message?: string})=> {
    console.log('FormError received message:', message)
    if(!message) return null
    return (
        <div className="bg-destructive flex items-center gap-2 bg-red-400 my-4  text-secondary-foreground p-3 rounded-md">
            <AlertCircle className="w-8 h-8" />
            <p>{message}</p>
        </div>
    )
}