import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise
          const db = client.db()

          const user = await db
            .collection('users')
            .findOne({ email: credentials?.email })

          if (!user) {
            // throw new Error('No user found with that email.') // this will crash the app
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials!.password,
            user.password
          )
          if (!isValid) {
            // throw new Error('Invalid password.')
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          }
        } catch (err) {
          console.error('[AUTH ERROR]', err)
          return null;
          // throw new Error(
          //   'Authentication failed. Please check your credentials.'
          // )
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // scope: 'openid profile email', // Ensure to get profile and email info
    }),
  ],

  session: {
    strategy: 'jwt', // Use JWT for session
  },

  pages: {
    signIn: '/login', // Define custom sign-in page
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const client = await clientPromise;
        const db = client.db();
  
        const existingUser = await db.collection('users').findOne({ email: user.email });
  
        if (!existingUser) {
          const fullName = user.name || '';
          const username = user.email?.split('@')[0] || 'user';
  
          await db.collection('users').insertOne({
            name: fullName,
            username: username,
            email: user.email,
            password: null,
            isVerified: true,
            isAdmin: false,
            image: user.image || `https://ui-avatars.com/api/?name=${fullName}&background=random&bold=true&format=png`,
            provider: 'google',
            isUserOnline: false,
            lastOnline: null,
            forgotpasswordToken: null,
            forgotpasswordTokenExpiry: null,
            verifyToken: null,
            verifyTokenExpiry: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
      return true;
    },
  
    async jwt({ token, user, account }) {
    
      if (account?.provider === 'google') {
        const client = await clientPromise;
        const db = client.db();
    
        // Find the real MongoDB user by email
        const existingUser = await db.collection('users').findOne({ email: token.email });
    
        if (existingUser) {
          token._id = existingUser._id.toString(); // Attach real MongoDB _id
        }
      } 
      else if (user) {
        token._id = user.id?.toString();
      }
    
      return token;
    },
  
    async session({ session, token }) {
      console.log(`------------------ session -------------------`); // DEBUGGING
      console.log(`session -> `, session); // DEBUGGING
      console.log(`token --> `, token); // DEBUGGING
      // if (session.user) {
      //   session.user.id = token.id; // Expose _id to session.user.id
      // }
      return session;
    },
  },
})

export { handler as GET, handler as POST }
