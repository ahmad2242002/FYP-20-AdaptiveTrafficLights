import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:3000/api/signin", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();
        
        if (res.ok && user) {
          return user;
        }

        return Promise.reject('/');
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.expires = new Date(Date.now() + 10 * 1000); // 10 seconds for testing
      return Promise.resolve(session);
    },
    async jwt({ token, account, user, accountType, session }) {
      // Update the token expiration when the session is updated
      if (user && session) {
        token.expires = session.expires;
      }
      return Promise.resolve(token);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
