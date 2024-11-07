'use client';

import { useEffect, useState } from "react";
import { createClient } from "~/lib/supabase/client";

import { createContext } from "react";
import type { User, UserMetadata } from "@supabase/auth-js";
import { refreshQuota } from "~/lib/actions";

export const UserContext = createContext<{
  user: CustomUser | null;
  isUserSubscribed: () => boolean;
  reduceQuotaByOne: () => void;
} | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void supabase.auth.getUser().then(({ data }) => {
          console.log('user metadata added to context.')
          setUser(data.user as CustomUser);

          // refresh quota
          const refreshInterval = (data?.user as CustomUser).user_metadata.quota.refreshQuotaInterval;
          const lastQuotaRefreshedAt = (data?.user as CustomUser).user_metadata.quota.lastQuotaRefreshedAt;
          void refreshQuota(refreshInterval, lastQuotaRefreshedAt, data?.user?.id ?? "");
        }).catch((err) => {
          console.error('Error fetching user', err);
          setUser(null);
        });

        // console.log('session', session.user)
        // setUser(session.user as CustomUser);
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
    return user.user_metadata?.isSubscribed ?? false;
  };

  const reduceQuotaByOne = () => {
    if (!user) return;

    setUser((p) => {
      if (!p) return null;
      return ({
        ...p,
        user_metadata: {
          ...p.user_metadata,
          quota: {
            ...p.user_metadata.quota,
            consumed: {
              ...p.user_metadata.quota.consumed,
              articleGeneration: (p.user_metadata.quota.consumed.articleGeneration ?? 0) - 1
            },
            allowed: {
              ...p.user_metadata.quota.allowed,
              articleGeneration: (p.user_metadata.quota.allowed.articleGeneration ?? 0) - 1
            }
          },
        }
      });
    });
  };

  return (
    <UserContext.Provider value={{ user, isUserSubscribed, reduceQuotaByOne }}>
      {children}
    </UserContext.Provider>
  );
}

export interface CustomUser extends User {
  user_metadata: CustomUserMetadata;
}

export interface CustomUserMetadata extends UserMetadata {
  invoiceId?: string;
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
  [key: string]: any;
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