'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Oops! Page not found</p>
        <div className="mb-8">
          {/* <Image
            src="/page-not-found.svg"
            alt="404 Illustration"
            width={200}
            height={200}
            className="mx-auto"
          /> */}
        </div>
        <p className="mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          onClick={() => router.push('/')}
          className="inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  )
}