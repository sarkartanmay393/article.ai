import type { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { updateUserMetadata } from "~/lib/actions"; // Assume this is a function to update user metadata in Supabase

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
          await updateUserMetadata(data.customer, {
            isSubscribed: true,
            subscriptionId: data.subscription as string,
            subscriptionStatus: data.status as string,
            subscribedAt: data.created,
            permissions: decidePermissionsToGive(data),
          });
          break;
        }
        case "payment_intent.succeeded": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.PaymentIntent;
          console.log(`💰 PaymentIntent succeeded: ${data.id}`);
          await updateUserMetadata(data.customer, {
            subscriptionStatus: data.status as string,
          });
          break;
        }
        case "invoice.payment_succeeded": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Invoice;
          console.log(`💰 Payment succeeded for invoice: ${data.id}`);
          await updateUserMetadata(data.customer, {
            subscriptionStatus: data.status as string,
          });
          break;
        }
        case "invoice.payment_failed": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Invoice;
          console.log(`❌ Payment failed for invoice: ${data.id}`);
          await updateUserMetadata(data.customer, {
            subscriptionStatus: data.status as string,
          });
          break;
        }
        case "customer.subscription.updated": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Subscription;
          console.log(`🔄 Subscription updated: ${data.id}`);
          await updateUserMetadata(data.customer, {
            subscriptionStatus: data.status,
          });
          break;
        }
        case "customer.subscription.deleted": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Subscription;
          console.log(`❌ Subscription canceled: ${data.id}`);
          await updateUserMetadata(data.customer, {
            isSubscribed: false,
            subscriptionStatus: data.status,
          });
          break;
        }
        case "customer.subscription.trial_will_end": {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const data = event.data.object as Stripe.Subscription;
          console.log(`⏳ Trial will end soon for subscription: ${data.id}`);
          // Notify user about trial ending
          break;
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
function decidePermissionsToGive(data: Stripe.Checkout.Session | Stripe.Subscription): string[] {
  // Implement logic to decide permissions based on subscription details
  return [""];
}