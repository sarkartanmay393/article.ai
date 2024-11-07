import type { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { updateUserMetadata } from "~/lib/actions"; // Assume this is a function to update user metadata in Supabase
import { PriceIds } from "~/lib/constants";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "invoice.paid",
    "invoice.payment_failed",
    "customer.subscription.deleted",
    // "customer.subscription.trial_will_end",
    "customer.subscription.updated"
  ];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const data = event.data.object;
          console.log(`💰 CheckoutSession completed: ${data.id}`);

          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              isSubscribed: true,
              subscriptionId: data.subscription?.toString() ?? '',
              subscriptionStatus: 'active',
              subscribedAt: new Date().valueOf(),
              ...decidePermissionsAndQuotaToGive(data.metadata?.priceId ?? ''),
            }
          });
          break;
        }
        case "invoice.paid": {
          const data = event.data.object;
          console.log(`💰 invoice.paid: ${data.id}`);
          console.log(`💰 invoice.paid 2: ${JSON.stringify(data)}`);

          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              ...decidePermissionsAndQuotaToGive(data.metadata?.priceId ?? ''),
            }
          });
          break;
        }
        case "invoice.payment_failed": {
          const data = event.data.object;
          console.log(`💰 Invoice Payment failed: ${data.id}`);

          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              isSubscribed: false,
              subscriptionStatus: 'past_due',
              ...decidePermissionsAndQuotaToGive(''),
            }
          });
          break;
        }
        case "customer.subscription.deleted": {
          const data = event.data.object;
          console.log(`❌ Subscription canceled: ${data.id}`);
          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              isSubscribed: false,
              subscriptionStatus: 'cancelled',
              subscriptionId: '',
              invoiceId: '',
              stripeCustomerId: '',
              ...decidePermissionsAndQuotaToGive(''),
            }
          });
        }
        case "customer.subscription.updated": {
          const data = event.data.object;
          console.log(`❌ Subscription updated: ${data.id}`);
          console.log(`❌ Subscription updated: ${JSON.stringify(data)}`);
          
          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              ...decidePermissionsAndQuotaToGive(data.metadata.priceId ?? ''),
            }
          });
        }
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }

      return NextResponse.json({ message: "Received" }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
// Helper function to decide permissions based on subscription
export function decidePermissionsAndQuotaToGive(priceId: string) {
  switch (priceId) {
    case PriceIds.pro:
      return {
        permissions: ['max:article-length:1000', `max:article:500`],
        quota: {
          allowed: {
            articleGeneration: 500,
          },
          consumed: {
            articleGeneration: 0,
          },
          refreshQuotaInterval: 'monthly',
          lastQuotaRefreshedAt: Date.now(),
        },
      };
    case PriceIds.basic:
      return {
        permissions: ['max:article-length:200', `max:article:100`],
        quota: {
          allowed: {
            articleGeneration: 100,
          },
          consumed: {
            articleGeneration: 0,
          },
          refreshQuotaInterval: 'monthly',
          lastQuotaRefreshedAt: Date.now(),
        },
      };
    default:
      return {
        permissions: ['max:article-length:100', `max:article:5`],
        quota: {
          allowed: {
            articleGeneration: 5,
          },
          consumed: {
            articleGeneration: 0,
          },
          refreshQuotaInterval: 'daily',
          lastQuotaRefreshedAt: Date.now(),
        },
      };
  }
}