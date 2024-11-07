'use client';

import { useEffect, useState } from "react";
import { createClient } from "~/lib/supabase/client";

import { createContext } from "react";
import type { User, UserMetadata } from "@supabase/auth-js";

export const UserContext = createContext<{
  user: CustomUser | null;
  isUserSubscribed: () => boolean;
} | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log(session.user)
        setUser(session.user as CustomUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isUserSubscribed = () => {
    if (!user) return false;
    return user.user_metadata.isSubscribed;
  };

  return (
    <UserContext.Provider value={{ user, isUserSubscribed }}>
      {children}
    </UserContext.Provider>
  );
}

export interface CustomUser extends User {
  user_metadata: CustomUserMetadata;
}

export interface CustomUserMetadata extends UserMetadata {
  [key: string]: any;
  isSubscribed: boolean;
  subscribedAt?: number; // time epoch
  subscriptionId?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: SubscriptionStatus | string;
  permissions: string[];
  quota: {
    allowed: {
      articleGeneration: number;
    };
    consumed: {
      articleGeneration: number;
    };
    refreshQuotaInterval: RefreshQuotaIntevel | string;
    lastQuotaRefreshedAt: number; // time epoch\
  };
}

export enum RefreshQuotaIntevel {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  Cancelled = 'cancelled',
  PastDue = 'past_due',
  Unpaid = 'unpaid',
  None = 'none',
}