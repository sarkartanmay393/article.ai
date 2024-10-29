import { ChevronUp, User2Icon } from "lucide-react";
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
import Image from "next/image";
import Link from "next/link";
import { createClient } from "~/lib/supabase/server";

export async function AppSidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
                  {!user?.user_metadata?.avatar_url ? <User2Icon className="w-8 h-8 rounded-full" /> :
                    <Image
                      width={20}
                      height={20}
                      className="rounded-full"
                      src={user?.user_metadata?.avatar_url ?? ''}
                      alt={user?.user_metadata?.user_name + 'profile-pic' ?? ''}
                    />}
                  <span>{user?.user_metadata?.full_name ?? user?.email ?? 'Not logged in'}</span>
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
                <DropdownMenuItem>
                  <Link href='subscription' className="w-full cursor-pointer">
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                {user ?
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
