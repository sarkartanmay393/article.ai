import type Stripe from 'stripe';
import { type NextRequest, NextResponse } from 'next/server';
import { stripe } from '~/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as { priceId: string, userId: string };
    const priceId = data.priceId;
    const userId = data.userId;
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/checkout/result`,
        metadata: {
          userId,
          priceId
        }
      });

    // const supabase = await createAdminClient();
    // const { error } = await supabase.from('subscriptions').upsert({
    //   userId: userId,
    //   stripeCustomerId: checkoutSession.customer as string,
    // });

    // if (error) {
    //   console.log(error);
    //   return new NextResponse('Internal Server', { status: 500 });
    // }

    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server', { status: 500 });
  }
}