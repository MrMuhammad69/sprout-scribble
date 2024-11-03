'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { AuthCard } from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";// Make sure login-schema path is correct
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RegisterSchema } from "@/types/RegisterSchema";
import { emailRegister } from "@/Server/actons/EmailSignUp";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./form-error";

// Define LoginForm component
export const RegisterFrom = () => {
  // Initialize useForm hook with resolver and default values
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    },
  });

  const [error, setError]  = useState('')
  const [success, setSuccess] = useState('')
  const {execute, status} = useAction(emailRegister, {
    onSuccess(data){
      if(data.success){
        setSuccess(data.success)
      }
      if(data.error){
        setError(data.error)
      }
    }
  }
  )

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values)
  };

  // Render the form component
  return (
    <AuthCard
      cardTitle="Create an account"
      backButtonHref="/auth/login"
      backButtonLabel="Don't have an account? Sign up"
      showSocials={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} onChange={field.onChange} value={field.value} placeholder="Please Enter your Email" autoComplete="email"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} onChange={field.onChange} value={field.value} placeholder="Your username" />
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
          <Button type="submit" className={cn('w-full my-2', status === 'executing'? 'animate-pulse' : '')} >{'Register'}</Button>
        </form>
      </Form>
    </AuthCard>
  );
};
