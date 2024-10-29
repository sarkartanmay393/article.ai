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
  isSubscribed: boolean;
  subscriptionStatus: SubscriptionStatus | string;
  expiresAt?: Date | null;
  renewalDate?: Date | null;
  subscriptionId?: string | null;
  subscriptionHistory: any;
  permissions: string[];
  lastPaymentAmount?: number;
  refreshQuotaInterval?: string | RefreshQuotaIntevel;
  lastQuotaRefreshedAt?: Date | null;
  remaining: {
    articleGeneration: 0,
  }
}

export enum RefreshQuotaIntevel {
  Daily = 'daily',
}

export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  Cancelled = 'cancelled',
  PastDue = 'past_due',
  Unpaid = 'unpaid',
  None = 'none',
}