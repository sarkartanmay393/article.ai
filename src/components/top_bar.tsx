'use client';

import { useContext } from "react";
import { UserContext } from "./user_context";
import Link from "next/link";
import Image from "next/image";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User2Icon } from "lucide-react";

export default function TopBar() {
  const userContextValue = useContext(UserContext);
  const userMetadata = userContextValue?.user?.user_metadata;

  return (
    <div className="max-h-[64px] flex items-center justify-between p-1.5 border-b border-gray-200 bg-slate-100">
      <div className="w-full flex items-center justify-between space-x-4 px-2 bg-transparent">
        <Link href='/'>
          <div className="w-fit select-none cursor-pointer flex items-center justify-center text-md font-normal gap-1 rounded-md bg-white p-1 py-0.5 shadow-none">
            <Image src='/logo-transparent.png' width={24} height={24} alt='article.ai logo' />
            Article AI
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <p className="text-sm">Credit: {userMetadata?.quota.allowed.articleGeneration}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className="flex items-center gap-1">
                {!userMetadata?.avatar_url ? <User2Icon className="w-8 h-8 rounded-full" /> :
                  <Image
                    width={20}
                    height={20}
                    className="rounded-full"
                    src={userMetadata?.avatar_url ?? ''}
                    alt={userMetadata?.user_name + 'profile-pic' ?? ''}
                  />}
                <span>{userMetadata?.full_name ?? userContextValue?.user?.email ?? 'Not logged in'}</span>
                {/* <ChevronUp className="ml-auto" /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem>
                <Link href='account' className={"w-full cursor-pointer" + userMetadata ? '' : 'pointer-events-none opacity-50'}>
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='subscription' className={"w-full cursor-pointer" + userMetadata ?'' : 'pointer-events-none opacity-50'}>
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              {userMetadata ?
                <DropdownMenuItem asChild>
                  <Link href='/auth/logout' className="w-full cursor-pointer">
                    Sign out
                  </Link>
                </DropdownMenuItem>
                :
                <DropdownMenuItem asChild>
                  <Link href='/auth' className="w-full cursor-pointer">
                    Sign In
                  </Link>
                </DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}