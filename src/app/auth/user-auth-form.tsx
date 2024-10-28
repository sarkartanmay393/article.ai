/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Button } from "~/components/ui/button"
import { signInWithGithub } from "~/lib/actions"
// import { Input } from "~/components/ui/input"
// import { Label } from "~/components/ui/label"

import { cn } from "~/lib/utils"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter();

  // async function onSubmit(event: React.SyntheticEvent) {
  //   event.preventDefault()
  //   setIsLoading(true)

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // const form = event.currentTarget as HTMLFormElement;
    // const emailInput = form.elements.namedItem("email") as HTMLInputElement;

  //   setIsLoading(false)
  // }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
      <Button onClick={async () => {
        setIsLoading(true)
        const data = await signInWithGithub();
        if (data && data.redirect.destination) {
          router.push(data.redirect.destination);
        }
        setIsLoading(false);
      }} variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  )
}
