import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function Homepage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <Card className="w-[350px] shadow-2xl transition-transform hover:scale-105">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 animate-fade-in">
            article.ai
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Unlock the power of AI for effortless article creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-md font-medium text-gray-700 mb-2">
            We’re almost there. Get ready to explore endless possibilities!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-1 transition-all hover:scale-105 focus:ring focus:ring-purple-300" asChild>
            <Link href="/demo">
              Try it now!
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
