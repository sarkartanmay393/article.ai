/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
    redirectProxyUrl: `http://localhost:3000/api/auth/callback/github`,
  })],
  pages: {
    signIn: "/auth",
  },
})

export { auth as middleware };
