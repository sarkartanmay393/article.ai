import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import type Stripe from "stripe";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "~/components/ui/card";
import { verifyCheckoutSession } from "~/lib/actions";

interface ResultPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps): Promise<JSX.Element> {
  let status: 'loading' | 'success' | 'failed' = 'loading';

  if (searchParams.session_id) {
    const checkoutSession = await verifyCheckoutSession(searchParams.session_id);
    if (!checkoutSession) {
      throw new Error('Invalid session ID');
    }
    const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

    if (paymentIntent?.status === "succeeded") {
      status = 'success';
    } else if (paymentIntent?.status === "canceled") {
      status = 'failed';
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-2">
      <CardHeader>
        <CardDescription>
          {status === 'loading' ? 'Checking payment status...' : `Payment ${status}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-blue-500" />}
        {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
        {status === 'failed' && <XCircle className="h-12 w-12 text-red-500" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        {status === 'success' && (
          <Button asChild>
            <Link href='/'>
              Return to Home
            </Link>
          </Button>
        )}
        {status === 'failed' && (
          <Button asChild>
            <Link href='/subscription'>
              Try Again
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}