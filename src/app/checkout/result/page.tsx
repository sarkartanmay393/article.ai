import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type Stripe from "stripe";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "~/components/ui/card";
import { updateUserMetadata, verifyCheckoutSession } from "~/lib/actions";
import { createClient } from "~/lib/supabase/server";

interface ResultPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps): Promise<JSX.Element> {
  // let status: 'loading' | 'success' | 'failed' = 'loading';

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error('user no found!`');
  }

  if (searchParams.session_id) {
    const checkoutSession = await verifyCheckoutSession(searchParams.session_id);
    console.log('Checkout session: 2', checkoutSession);
    if (!checkoutSession) {
      throw new Error('Invalid session ID');
    }

    // storing customer id in user metadata when creating checkout session
    const response = await updateUserMetadata({
      userId: userData.user.id,
      updateUserMetadata: {
        stripeCustomerId: checkoutSession.customer as string,
        priceId: checkoutSession.metadata?.priceId ?? '',
        invoiceId: checkoutSession.invoice as string,
      }
    });

    if (response instanceof Error) {
      console.log(response.message);
      throw new Error('Internal Server');
    }

    const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

    // if (paymentIntent?.status === "succeeded") {
    //   status = 'success';
    // } else 
    if (paymentIntent?.status === "canceled") {
      throw new Error('Payment cancelled');
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-2">
      <CardHeader>
        <CardDescription>
          Payment Successfull! 🎉
          {/* {status === 'loading' ? 'Checking payment status...' : `Payment ${status}`} */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {/* {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-blue-500" />} */}
        <CheckCircle className="h-12 w-12 text-green-500" />
        {/* {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />} */}
        {/* {status === 'failed' && <XCircle className="h-12 w-12 text-red-500" />} */}
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* {status === 'success' && ( */}
        <Button asChild>
          <Link href='/demo'>
            Return to App
          </Link>
        </Button>
        {/* )} */}
        {/* {status === 'failed' && ( */}
        {/* <Button asChild>
            <Link href='/subscription'>
              Try Again
            </Link>
          </Button> */}
        {/* )} */}
      </CardFooter>
    </Card>
  );
}