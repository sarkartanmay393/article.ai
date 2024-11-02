import type { Stripe } from "stripe";

import PrintObject from "~/components/PrintObject";
// import { updateUserMetadata } from "~/lib/actions";
import { stripe } from "~/lib/stripe";

interface ResultPageProps {
  searchParams: {
    session_id: string;
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps): Promise<JSX.Element> {
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

  // if (paymentIntent)
  //   await updateUserMetadata({
  //     subscriptionStatus: paymentIntent?.status,
  //     isSubscribed: paymentIntent?.status === "succeeded",
  //     renewalDate: new Date(paymentIntent?.created * 1000),
  //     subscriptionId: paymentIntent?.id,
  //     lastPaymentAmount: paymentIntent?.amount,
  //     permissions: decidePermissionsToGive(paymentIntent),
  //   });

  return (
    <>
      <h2>Status: {paymentIntent?.status}</h2>
      <h3>Checkout Session response:</h3>
      <PrintObject content={checkoutSession} />
    </>
  );
}

// const decidePermissionsToGive = (paymentIntent: Stripe.PaymentIntent): string[] => {
//   const permissions: string[] = [];

//   if (paymentIntent.amount === 0) {
//     permissions.push(...["max-articles:5", "max-words:200", "functions::SEO-optimization", "functions::fact-checking"]);
//   } else if (paymentIntent.amount === 20) {
//     permissions.push(...["max-articles:250", "max-words:1000", "functions::SEO-optimization", "functions::fact-checking"]);
//   }

//   return permissions;
// };