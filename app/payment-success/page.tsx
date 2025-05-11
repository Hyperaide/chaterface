'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, you might want to fetch session details from your backend
  // to verify the session and display more information.
  // For now, we'll just acknowledge the success.

  useEffect(() => {
    if (sessionId) {
      console.log('Payment successful for session ID:', sessionId);
      // Here you could make a call to your backend if needed,
      // e.g., to trigger any post-payment client-side actions
      // or to fetch more details for display.
      setIsLoading(false);
    } else {
      setError('Session ID is missing. Payment status cannot be confirmed.');
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'red' }}>
        <h1>Payment Confirmation Error</h1>
        <p>{error}</p>
        <Link href="/">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <p>Your session ID is: {sessionId}</p>
      {/* You can add more details here if you fetch them */}
      <br />
      <Link href="/">Return to Homepage</Link>
    </div>
  );
} 