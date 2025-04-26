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
            throw new Error('No user found with that email.')
          }

          const isValid = await bcrypt.compare(
            credentials!.password,
            user.password
          )
          if (!isValid) {
            throw new Error('Invalid password.')
          }

          return {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
          }
        } catch (err) {
          console.error('[AUTH ERROR]', err)
          throw new Error(
            'Authentication failed. Please check your credentials.'
          )
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: 'openid profile email', // Ensure to get profile and email info
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
      if (account.provider === 'google') {
        const client = await clientPromise
        const db = client.db()

        const existingUser = await db
          .collection('users')
          .findOne({ email: user.email })

        if (!existingUser) {
          const fullName = user.name || ''
          const username = user.email?.split('@')[0] || 'user'

          // Save user data in the same format as manual sign-up
          await db.collection('users').insertOne({
            name: fullName,
            username: username,
            email: user.email,
            password: null, // No password for Google sign-in
            isVerified: true, // Automatically verified when using Google
            isAdmin: false, // Set based on your use case
            image:
              user.image ||
              `https://ui-avatars.com/api/?name=${fullName}&background=random&bold=true&format=png`,
            provider: 'google',
            isUserOnline: false, // Assuming the user isn't online when first created
            lastOnline: null, // Initially null
            forgotpasswordToken: null, // No token for Google users
            forgotpasswordTokenExpiry: null, // No expiry for Google users
            verifyToken: null, // No token needed as Google already verifies
            verifyTokenExpiry: null, // No expiry needed for Google
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      }
      return true
    },

    async session({ session, token }) {
      // Attach user info from token to the session object
      session.user.id = token.sub
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }
