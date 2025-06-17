'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (sessionId) {
      setIsLoading(false);
    } else {
      setError('Session ID is missing. Payment status cannot be confirmed.');
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen flex-col text-center'>
        <p className='text-sm font-medium text-sage-10'>Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen flex-col text-center'>
        <h1 className='font-medium text-sage-12'>Payment Confirmation Error</h1>
        <p className='text-sm font-medium text-sage-10'>{error}</p>
        <Link href="/" className='text-sm font-medium text-sage-10'>Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center h-screen flex-col text-center'>
      <h1 className='font-medium text-sage-12'>Payment Successful!</h1>
      <p className='text-sm font-medium text-sage-10'>Credits might take a few seconds to appear.</p>
      <br />
      <Link href="/" className='text-sm font-medium text-sage-10 underline'>Return to Homepage</Link>
    </div>
  );
} 