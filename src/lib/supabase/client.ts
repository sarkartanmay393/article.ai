/* eslint-disable react-hooks/rules-of-hooks */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "~/lib/types/database.types";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );