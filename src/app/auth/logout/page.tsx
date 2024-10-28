'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "~/lib/supabase/client";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    void ((async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error as Error;
        router.replace('/')
      } catch (error) {
        console.error(error);
      }
    })());
  }, []);


  return (
    <div className="w-full flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold">Logging out...</h1>
      </div>
    </div>
  );
}