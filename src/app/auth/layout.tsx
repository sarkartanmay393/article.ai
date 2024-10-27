import { redirect } from "next/navigation";
import { auth } from "~/lib/server/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session) {
    return redirect('/demo');
  }

  return (
    <div className="flex h-screen">
      {children}
    </div>
  )
}