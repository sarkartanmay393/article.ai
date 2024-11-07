import type { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { updateUserMetadata } from "~/lib/actions"; // Assume this is a function to update user metadata in Supabase
import { createAdminClient } from "~/lib/supabase/admin";
import { PriceIds } from "~/lib/constants";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
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
    "payment_intent.succeeded",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.trial_will_end",
  ];

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession completed: ${data.id}`);

          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              isSubscribed: true,
              subscriptionId: data.subscription?.toString() ?? '',
              subscriptionStatus: 'active',
              subscribedAt: new Date().valueOf(),
              ...decidePermissionsAndQuotaToGive(''),
            }
          });
          break;
        }
        case "invoice.paid": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Invoice;
          console.log(`💰 CheckoutSession completed: ${data.id}`);

          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              ...decidePermissionsAndQuotaToGive(''),
            }
          });
          break;
        }
        case "invoice.payment_failed": {
          const data = event.data.object;
          console.log(`💰 CheckoutSession completed: ${data.id}`);

          await updateUserMetadata({
            userId: data.metadata?.userId ?? '',
            updateUserMetadata: {
              isSubscribed: false,
              subscriptionStatus: 'past_due',
              ...decidePermissionsAndQuotaToGive('remove'),
            }
          });
          break;
        }
        case "customer.subscription.updated": {
          const data = event.data.object;
          console.log(`🔄 Subscription updated: ${data.id}`);

          // const supabase = await createAdminClient();
          // // eslint-disable-next-line @typescript-eslint/no-base-to-string
          // const userIdResponse = await supabase.from('subscriptions').select('userId').eq('stripeCustomerId', data.customer.toString()).single();
          // if (userIdResponse.error || userIdResponse.data?.userId === null) {
          //   console.log(userIdResponse.error);
          //   return NextResponse.json(
          //     { message: "Error fetching userId" },
          //     { status: 500 },
          //   );
          // }

          // TODO: handle this
          // await updateUserMetadata({
          //   userId: userIdResponse.data?.userId,
          //   updateUserMetadata: {
          //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          //     // 
          //   }
          // });
          break;
        }
        case "customer.subscription.deleted": {
          const data = event.data.object;
          console.log(`❌ Subscription canceled: ${data.id}`);

          const supabase = await createAdminClient();
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const userIdResponse = await supabase.from('subscriptions').select('userId').eq('stripeCustomerId', data.customer?.toString()).single();
          if (userIdResponse.error || userIdResponse.data?.userId === null) {
            console.log(userIdResponse.error);
            return NextResponse.json(
              { message: "Error fetching userId" },
              { status: 500 },
            );
          }

          await updateUserMetadata({
            userId: userIdResponse.data?.userId ?? data.metadata?.userId ?? '',
            updateUserMetadata: {
              isSubscribed: false,
              subscriptionStatus: 'removed',
              subscriptionId: '',
              ...decidePermissionsAndQuotaToGive('remove'),
            }
          });
        }
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
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
function decidePermissionsAndQuotaToGive(priceId: string) {
  switch (priceId) {
    case 'remove': {
      return {
        permissions: [],
        quota: {
          allowed: {
            articleGeneration: 0,
          },
          consumed: {
            articleGeneration: 0,
          },
          refreshQuotaInterval: 'never',
          lastQuotaRefreshedAt: new Date().valueOf(),
        },
      };
    }
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
          lastQuotaRefreshedAt: new Date().valueOf(),
        },
      };
    default:
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
          lastQuotaRefreshedAt: new Date().valueOf(),
        },
      };
  }
}