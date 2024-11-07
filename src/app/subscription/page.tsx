import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Check } from "lucide-react"
import CheckoutButton from "~/components/CheckoutButton"
import { PriceIds } from "~/lib/constants";

const plans = [
  {
    priceId: PriceIds.basic,
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
    priceId: PriceIds.pro,
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
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full h-full space-y-8 flex flex-col">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Subscription Plans</h1>
          <p className="text-center text-gray-600 mb-6">Choose a plan that fits your needs and start leveraging our platform to its fullest!</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={` flex flex-col bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:border-2 hover:border-indigo-500 transition-all duration-250`}>
              <CardHeader className="bg-indigo-50 px-6 py-4">
                <CardTitle className="text-2xl text-indigo-700">{plan.name}</CardTitle>
                <CardDescription className="text-gray-500">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <p className="text-4xl font-bold mb-4 text-indigo-700">{plan.price}<span className="text-lg font-normal text-gray-500">/month</span></p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-indigo-100 px-6 py-4">
                <CheckoutButton priceId={plan.priceId} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-150" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}