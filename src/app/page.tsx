import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function Homepage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">article.ai</CardTitle>
          <CardDescription className="text-center">AI-powered article generation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-2xl font-semibold">Coming Soon!</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">Interested?</Button>
        </CardFooter>
      </Card>
    </div>
  )
}