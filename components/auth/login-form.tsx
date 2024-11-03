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

// Define LoginForm component
export const LoginForm = () => {
  // Initialize useForm hook with resolver and default values
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError]  = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const { execute, status, } = useAction(emailSignIn, {
    onSuccess(data) {
        console.log('Success data:', data)
        if (data?.error) {
            setSuccess('')
            setError(data.error)
            return
        }
        setError('') // Clear any previous errors
        setSuccess(data?.success || '')
        if (data?.url) {
            setTimeout(() => {
                router.push(data.url);
                router.refresh();
            }, 1000); // Small delay to show success message
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
          {/* Email Field */}
          <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} onChange={field.onChange} value={field.value} placeholder="Enter your email" autoComplete="email"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} onChange={field.onChange} value={field.value} placeholder="Enter your password" autoComplete="current-password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSuccess message={success} />
          <FormError message={error} />

          {/* Submit Button */}
          <Button size={'sm'} variant={'link'} asChild>
            <Link href="/auth/reset">
              Forgot your password?
            </Link>
            </Button>
          </div>
          <Button 
            type="submit" 
            className={cn('w-full my-2', 
                status === 'executing' ? 'opacity-50 cursor-not-allowed' : ''
            )}
            disabled={status === 'executing'}
          >
            {status === 'executing' ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
