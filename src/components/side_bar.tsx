import { ChevronUp } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "~/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { auth } from "~/lib/server/auth";
import Image from "next/image";
import Link from "next/link";
import { handleGithubLogout } from "~/lib/actions";

export async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href='/'>
          <div className="select-none cursor-pointer flex items-center text-md font-medium gap-1 border-[1px] rounded-md bg-white p-1 py-0.5 shadow-none">
            <Image src='/logo-transparent.png' width={32} height={32} alt='article.ai logo' />
            Article AI
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Image src={session?.user?.image ?? ''} width={20} height={20} alt={session?.user?.name ?? ''} className="rounded-full" />
                  <span>{session?.user?.name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem disabled>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <span>Billing</span>
                </DropdownMenuItem>
                <form action={handleGithubLogout}>
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full cursor-pointer">
                      <span>Sign out</span>
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
