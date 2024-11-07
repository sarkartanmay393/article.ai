"use client";

import React, { useContext, useState } from "react";

import { Button } from "./ui/button";
import getStripe from "~/lib/stripe/utils";
import { UserContext } from "./user_context";
import { Loader2Icon } from "lucide-react";

interface CheckoutButtonProps {
  priceId: string;
  currentActivePlanId?: string;
  className?: string;
}

export default function CheckoutButton({ priceId, className = "" }: CheckoutButtonProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const userContextValue = useContext(UserContext);
  const currentActivePlanId = userContextValue?.user?.user_metadata?.priceId as string;
  const isSubscribed = userContextValue?.isUserSubscribed() ?? false;

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      if (isSubscribed) {
        const resp = await fetch("/api/stripe/update", {
          method: "POST",
          body: JSON.stringify({
            newPriceId: priceId,
            subscriptionId: userContextValue?.user?.user_metadata?.subscriptionId,
          }),
        });

        if (!resp.ok) {
          throw new Error("Failed to create checkout session");
        }

        await resp.json();
        return;
      } else {
        const resp = await fetch("/api/stripe/checkout", {
          method: "POST",
          body: JSON.stringify({
            priceId: priceId,
            userId: userContextValue?.user?.id,
          }),
        });

        if (!resp.ok) {
          throw new Error("Failed to create checkout session");
        }

        const respData = await resp.json() as { result: { id: string } };

        await stripe.redirectToCheckout({
          sessionId: respData?.result?.id,
        });
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={className}
      type="submit"
      disabled={loading || priceId === currentActivePlanId}
      variant={currentActivePlanId === priceId ? "outline" : "default"}
      onClick={handleSubmit}
    >
      {loading ? <Loader2Icon className={"animate-spin w-3 h-3 mr-2" + (currentActivePlanId === priceId ? " cursor-not-allowed" : "")} /> : null}
      {Boolean(currentActivePlanId) ? (currentActivePlanId === priceId ? "Subscribed" : "Switch") : "Get Started"}
    </Button>
  );
}
