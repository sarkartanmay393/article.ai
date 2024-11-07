import { type NextRequest, NextResponse } from 'next/server';
import { stripe } from '~/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as { newPriceId: string, userId: string, subscriptionId: string };
    const newPriceId = data.newPriceId;
    const subscriptionId = data.subscriptionId;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0]?.id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    console.log('updated subscription', updatedSubscription)

    return NextResponse.json({ result: updatedSubscription, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server', { status: 500 });
  }
}