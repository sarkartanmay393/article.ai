import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '~/lib/supabase/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${(err as Error).message}`);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(event);
      break;
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

async function handleSubscriptionUpdate(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  // Fetch the user associated with this customerId
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  // Update permissions
  const newPermissions = [...(user.permissions || []), 'premium'];
  await supabase
    .from('users')
    .update({ permissions: newPermissions })
    .eq('id', user.id);
}

async function handleSubscriptionCancellation(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  // Similar logic to remove 'premium' from permissions
}