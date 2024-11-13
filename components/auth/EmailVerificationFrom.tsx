'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { VerfiyEmailToken } from '@/Server/actons/tokens';
import { useCallback, useEffect, useState } from 'react';
import { AuthCard } from './auth-card';
import { FormSuccess } from './FormSuccess';
import { FormError } from './form-error';

export const EmailVerificationForm = () => {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError('No token found');
      return;
    }
    VerfiyEmailToken(token).then((data) => {
      if (data.error) {
        setError(data.error);
        return;
      }
      if (data.success) {
        setSuccess(data.success);
        router.push('/auth/login');
      }
    });
  }, [token, success, error, router]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <AuthCard
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      cardTitle="Verify your account."
    >
      <div className="flex items-center flex-col w-full justify-center">
        <p>{!success && !error ? 'Verifying email...' : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};