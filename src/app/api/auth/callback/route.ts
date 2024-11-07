/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from 'next/server';
import { createAdminClient } from '~/lib/supabase/admin';
import { createClient } from '~/lib/supabase/server';
import { decidePermissionsAndQuotaToGive } from '../../webhook/stripe/route';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/demo'

  if (code) {
    const supabase = await createClient()
    const supabaseAdmin = await createAdminClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (data?.user?.id) {
      const { error: userError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        user_metadata: {
          isSubscribed: false,
          ...decidePermissionsAndQuotaToGive('')
        }
      });

      if (userError) {
        // TODO: need some mechanism to retry updating user metadata
        console.error('Error updating user metadata:', userError);
        return NextResponse.json({ error: 'Error updating user metadata' }, { status: 500 });
      }
    }

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}