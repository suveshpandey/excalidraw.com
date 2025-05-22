import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import dotenv from 'dotenv';
dotenv.config();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account?.provider === "google" && account?.id_token) {
        try {
          const response = await fetch('http://localhost:8080/api/v1/user/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: account.id_token }),
          });
          
          const data = await response.json();
          
          if (data.token) {
            // Store the token in localStorage (just like your current system)
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', data.token);
              localStorage.setItem('username', data.userData.username);
            }
            
            // Add to token
            token.backendToken = data.token;
            token.userData = data.userData;
          }
        } catch (error) {
          console.error("Error exchanging Google token:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.backendToken = token.backendToken;
      session.userData = token.userData;
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Redirect to dashboard after successful auth
      return `${baseUrl}/dashboard`;
    }
  },
  events: {
    async signIn({ account }: any) {
      if (account?.provider === "google") {
        console.log("Google user signed in");
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };