/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  })],
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   console.log("Redirecting to:", url);
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
    signIn: async ({ account, profile, email, credentials }) => {
      console.log("Signing in:", account, profile, email, credentials);
      return true;
    },
    async session({ session, token }) {
      console.log("Session:", session, token);
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      console.log("Authorized:", auth);
      return !!auth
    },
  }
})

export { auth as middleware };
