'use client';

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { AuthCard } from './auth-card';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormError } from './form-error';
import { FormSuccess } from './FormSuccess';
import { passwordReset } from '@/Server/actons/PasswordReset';
import { resetSchema } from '@/types/resetSchema';

// Define LoginForm component
export const ResetForm = () => {
  // Initialize useForm hook with resolver and default values
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const [error, setError]  = useState('');
  const [success, setSuccess] = useState('');

  const { execute, status } = useAction(passwordReset, {
    onSuccess(data) {
      console.log('Success data:', data);
      if (data?.error) {
        setSuccess('');
        setError(data.error);
        return;
      }
      setError(''); // Clear any previous errors
      setSuccess(data?.success || '');
    },
    onError(error) {
      console.log('Error:', error);
      setSuccess('');
      setError('Something went wrong');
    },
  });

  // Function to handle form submission
  const handleLogin = (values: z.infer<typeof resetSchema>) => {
    execute(values);

  };

  // Render the form component
  return (
    <AuthCard
      cardTitle="Forgot your password? Enter your email"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
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
                    <Input {...field} onChange={field.onChange} disabled={status === 'executing'} value={field.value} placeholder="Enter your email" autoComplete="current-password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />

            {/* Submit Button */}
            <Button size={'sm'} variant={'link'} asChild>
              <Link href="/auth/login">
              Back to login
              </Link>
            </Button>
          </div>
          <Button type="submit" className={cn('w-full my-2', status === 'executing'? 'animate-pulse' : '')}>{'Reset Password'}</Button>
        </form>
      </Form>
    </AuthCard>
  );
};
