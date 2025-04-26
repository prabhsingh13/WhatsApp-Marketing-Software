// /lib/auth.config.ts
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './mongodb' // Use mongoose version

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add more providers if needed
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/', // you can change this to your login page
  },
}
