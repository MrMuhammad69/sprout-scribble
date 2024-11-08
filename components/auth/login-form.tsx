'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { AuthCard } from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/types/login-schema"; // Make sure login-schema path is correct
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { emailSignIn } from "@/Server/actons/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormError } from "./form-error";
import { FormSuccess } from "./FormSuccess";
import { useRouter } from 'next/navigation'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"


// Define LoginForm component
export const LoginForm = () => {
  // Initialize useForm hook with resolver and default values
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError]  = useState('')
  const [success, setSuccess] = useState('')
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const router = useRouter()

  const { execute, status } = useAction(emailSignIn, {
    onSuccess: async (data) => {
        console.log('Success data:', data)
        if (data?.error) {
            setSuccess('')
            setError(data.error)
            return
        }
        
        setError('') // Clear any previous errors
        
        if (data?.twoFactor) {
            setShowTwoFactor(true)
            setSuccess(data.twoFactor)
            return
        }

        // Handle successful login (both regular and 2FA)
        if (data?.success) {
            setSuccess(data.success)
            if (data?.url) {
                setTimeout(() => {
                    router.push(data.url)
                    router.refresh()
                }, 1000)
            }
        }
    },
    onError(error) {
        console.log('Error:', error)
        setSuccess('')
        setError('Something went wrong')
    }
  })

  // Function to handle form submission
  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    setError('') // Clear any previous errors
    setSuccess('') // Clear any previous success messages
    execute(values)
  };

  // Render the form component
  return (
    <AuthCard
      cardTitle="Login"
      backButtonHref="/auth/register"
      backButtonLabel="New here?"
      showSocials={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
          {showTwoFactor ? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <InputOTP 
                      disabled={status === 'executing'} 
                      {...field} 
                      maxLength={6}>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />

                      </InputOTP>

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your email" autoComplete="email"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="Enter your password" 
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button size={'sm'} className="px-0 my-4" variant={'link'} asChild>
                  <Link href="/auth/reset">
                    Forgot your password?
                  </Link>
                </Button>
              </div>
            </>
          )}
          
          <FormSuccess message={success} />
          <FormError message={error} />

          <Button 
            type="submit" 
            className={cn('w-full my-2', 
              status === 'executing' ? 'opacity-50 cursor-not-allowed' : ''
            )}
            disabled={status === 'executing'}
          >
            {showTwoFactor && status === 'executing'? "Verifying...": "Verify"}
            {!showTwoFactor && status === 'executing'? "Logging in...": "Login"}

          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
