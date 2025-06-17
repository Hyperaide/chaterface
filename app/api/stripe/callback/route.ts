import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/instant-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('checkout_session_id');


    if (!sessionId) {
      return NextResponse.redirect(new URL('/payment/error', request.url));
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status === 'paid') {
      // get profile based
      const profileData = await db.query({
        userProfiles: {
          $: {
            where: {
              'user.id': checkoutSession.client_reference_id as string
            }
          },
          user: {}
        }
      })

      await db.transact(
        db.tx.userProfiles[profileData.userProfiles[0].id].update({
          stripeCustomerId: checkoutSession.customer as string,
          credits: 1000,
          stripeDetails: {
            stripeSubscriptionId: checkoutSession.subscription as string,
          }
        })
      );
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Stripe callback error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
