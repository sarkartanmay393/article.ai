/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from 'next/server';
import { createAdminClient } from '~/lib/supabase/admin';
import { createClient } from '~/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/demo'

  if (code) {
    const supabase = await createClient()
    const supabaseAdmin = await createAdminClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    // TODO: testing
    // const accessToken = await exchangeCodeForToken(code);
    // const githubUser = await fetchGitHubUser(accessToken);
    // await saveGitHubUserToSupabase(githubUser);
    if (data?.user?.id) {
      const { error: userError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        user_metadata: {
          isSubscribed: false,
          subscriptionStatus: "none",
          subscriptionId: "",
          subscriptionHistory: {},
          permissions: [
            "max-articles:0",
            "max-words:0",
          ],
          refreshQuotaInterval: 'daily',
          lastQuotaRefreshedAt: new Date(),
          remaining: {
            articleGeneration: 0,
          }
        }
      });

      if (userError) {
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

// async function exchangeCodeForToken(code: string): Promise<string> {
//   const response = await fetch('https://github.com/login/oauth/access_token', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       client_id: process.env.GITHUB_CLIENT_ID,
//       client_secret: process.env.GITHUB_CLIENT_SECRET,
//       code,
//     }),
//   });

//   const data = await response.json();
//   if (!data.access_token) {
//     throw new Error('Failed to obtain access token');
//   }

//   return data.access_token;
// }

// async function fetchGitHubUser(accessToken: string) {
//   const response = await fetch('https://api.github.com/user', {
//     headers: {
//       Authorization: `token ${accessToken}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch GitHub user');
//   }

//   return response.json();
// }

// async function saveGitHubUserToSupabase(githubUser: any) {
//   const { data, error } = await supabase
//     .from('users') // Replace 'users' with your actual table name
//     .upsert({
//       id: githubUser.id, // Assuming 'id' is the primary key
//       username: githubUser.login,
//       avatar_url: githubUser.avatar_url,
//       // Add other fields as necessary
//     });

//   if (error) {
//     console.error('Error saving GitHub user to Supabase:', error);
//   } else {
//     console.log('GitHub user saved to Supabase:', data);
//   }
// }