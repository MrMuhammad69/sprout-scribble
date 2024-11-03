'use client'
import { useEffect } from "react";

export default function Error({
    error,
    reset
}: {
    error: Error,
    reset: () => void
}) {
    useEffect(() => {
        console.log('Error')
    }, [error])
    return (
        <div className="w-full min-h-full flex items-center justify-center flex-col">
            <h1 className="text-4xl font-bold">
                {error.message }
            </h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => reset()}>Try Again</button>

        </div>
    )
}