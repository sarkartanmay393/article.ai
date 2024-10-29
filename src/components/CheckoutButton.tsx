"use client";

import React, { useState } from "react";

import { Button } from "./ui/button";
import { createCheckoutSession } from "~/lib/actions/stripe";

interface CheckoutButtonProps {
  amount: number;
  currentActivePlanAmount?: number;
  className?: string;
}

export default function CheckoutButton({ amount, currentActivePlanAmount = -1, className = "" }: CheckoutButtonProps): JSX.Element {
  const [loading] = useState<boolean>(false);

  const formAction = async (data: FormData): Promise<void> => {
    const { url } = await createCheckoutSession(data);
    window.location.assign(url!);
  };

  return (
    <>
      <form action={formAction} className="w-full">
        <input type="hidden" name="amount" value={amount} />
        <Button
          className={className}
          type="submit"
          disabled={loading || currentActivePlanAmount === amount}
          variant={currentActivePlanAmount === amount ? "outline" : "default"}
        >
          {currentActivePlanAmount >= 0 ? (currentActivePlanAmount === amount ? "Subscribed" : "Switch") : "Get Started"}
        </Button>
      </form>
    </>
  );
}
