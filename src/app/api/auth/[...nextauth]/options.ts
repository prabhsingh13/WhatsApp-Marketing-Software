import { NextAuthOptions } from 'next-auth'
// import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs';
import connect from '@/dbConfig/dbConfig'
import User from '@/models/userModel'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            await connect()
    
            const user = await User.findOne({ email: credentials?.email })
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
        },
        }),
    ],
    
    session: {
        strategy: 'jwt',
    },
    
    pages: {
        signIn: '/login',
    },
    
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.id = user.id
        }
        return token
        },
        async session({ session, token }) {
        if (token) {
            session.user.id = token.id as string
        }
        return session
        },
    },
}