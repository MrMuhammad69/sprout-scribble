'use client'

import { signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"   

export default function Socials() {
    return (
        <div className="flex flex-col gap-4 items-center w-full">
            <Button onClick={()=> signIn('google', {
                redirect: false,
                callbackUrl: '/',
            })} variant="outline"  className="flex gap-4 w-full">
                <p>
                Sign in with Google</p>
                <FcGoogle className='w-5 h-5' /> 
            </Button>
            <Button onClick={()=> signIn('github',{
                redirect: false,    
                callbackUrl: '/',
            })} variant="outline" className="flex gap-4 w-full">
                <p>
                Sign in with GitHub</p>
                <FaGithub className='w-5 h-5' /> 
            </Button>
        </div>
    )
}