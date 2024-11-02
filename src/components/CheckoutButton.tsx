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

export default function CheckoutButton({ priceId, currentActivePlanId = "", className = "" }: CheckoutButtonProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const userContextValue = useContext(UserContext);

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

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
      {loading ? <Loader2Icon className="animate-spin w-3 h-3 mr-2" /> : null}
      {Boolean(currentActivePlanId) ? (currentActivePlanId === priceId ? "Subscribed" : "Switch") : "Get Started"}
    </Button>
  );
}
