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
        const [rawUser] = await res.json();

        if (res.ok && rawUser) {
          // Extract specific properties from raw user data
          const { name, email, role } = rawUser[0];

          // Include additional properties like 'role'
          const user = {
            name,
            email,
            image:role,
          };

          // Include user data in the session
          return Promise.resolve(user);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      // Log the entire session object for debugging
      console.log("Session object:", session);
      console.log("Session object role:", session.user.image);
      

      // Log specific user properties
      if (user) {
        console.log("User in session callback:", user);
        // Access specific user properties, e.g., user name and role
        console.log("User Name:", user.name);
        console.log("User Role:", user.role);
      } else {
        console.log("User is undefined in session callback");
      }

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
