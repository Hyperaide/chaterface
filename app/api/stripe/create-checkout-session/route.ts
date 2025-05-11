import { db } from '@/lib/instant-admin';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// Ensure your Stripe secret key is set in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // Use the API version expected by the linter
  typescript: true,
});

export async function POST(request: Request) {
  try {
    const { amount } = await request.json(); // Amount in dollars
    const token = await request.headers.get('X-Token');

    let user;

    if(token) {
      user = await db.auth.verifyToken(token);
      if(!user) {
        return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
      }
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount specified.' }, { status: 400 });
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Chaterface Credits',
              // You can add a description or images here if needed
              // description: `One-time purchase of ${amount * 100} credits`,
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Make sure to replace these with your actual success and cancel URLs
      // You might want to use environment variables for these as well
      cancel_url: `${request.headers.get('origin')}`,
      success_url: `${request.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      client_reference_id: user?.id,
      // You can also pass metadata, customer email, etc.
      // metadata: { userId: 'some_user_id' }, // Example
      customer_email: user?.email, // If you have the user's email
    });

    if (session.url) {
      return NextResponse.json({ url: session.url });
    } else {
      return NextResponse.json({ error: 'Could not create Stripe session.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
