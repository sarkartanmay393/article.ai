'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Check } from "lucide-react"
import CheckoutButton from "~/components/CheckoutButton"
import { useContext } from "react";
import { UserContext } from "~/components/user_context";

const plans = [
  {
    name: "Basic",
    price: "$0",
    amount: 0,
    currency: 'usd',
    description: "For individuals just getting started",
    features: [
      "1 user",
      "5 articles",
      "Max 200 words",
      "SEO optimization",
      "Basic features"
    ]
  },
  {
    name: "Pro",
    price: "$20",
    amount: 20,
    currency: 'usd',
    description: "For professionals and teams",
    features: [
      "Everything in Basic",
      "Unlimited articles",
      "Max 1000 words",
      "Advanced features",
      "Priority support"
    ]
  }
]

export default function SubscriptionPage() {
  const userContextValue = useContext(UserContext);
  const metadata = userContextValue?.user?.user_metadata;

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900">Subcription Plans</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.name === "Pro" ? "border-primary" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4">{plan.price}<span className="text-base font-normal text-gray-600">/month</span></p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <CheckoutButton amount={plan.amount} className="w-full" currentActivePlanAmount={metadata?.isSubscribed ? metadata.lastPaymentAmount : -1} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}