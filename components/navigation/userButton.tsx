'use client'
import { Session } from "next-auth"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function UserButton({ user }: Session) {
    return (
        <>
        <h2 >
            {user?.email}
        </h2>
        <Button variant="default" onClick={()=> signOut()}>
            SignOut
        </Button>
        </>
        

    )
}