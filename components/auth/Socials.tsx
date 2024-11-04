'use client'

import { signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"   
import { useState } from "react"
import { FormError } from "./form-error"

export default function Socials() {
    const [error, setError] = useState<string | null>(null);

    const handleSocialSignIn = async (provider: 'google' | 'github') => {
        try {
            const result = await signIn(provider, {
                redirect: false,
                callbackUrl: '/',
            });

            if (result?.error) {
                setError("Authentication failed. Please try again.");
            }
        } catch (error) {
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center w-full">
            {error && <FormError message={error} />}
            <Button 
                onClick={() => handleSocialSignIn('google')} 
                variant="outline"  
                className="flex gap-4 w-full"
            >
                <p>Sign in with Google</p>
                <FcGoogle className='w-5 h-5' /> 
            </Button>
            <Button 
                onClick={() => handleSocialSignIn('github')} 
                variant="outline" 
                className="flex gap-4 w-full"
            >
                <p>Sign in with GitHub</p>
                <FaGithub className='w-5 h-5' /> 
            </Button>
        </div>
    )
}