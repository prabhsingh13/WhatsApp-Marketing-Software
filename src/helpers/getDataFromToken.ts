import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { getToken } from 'next-auth/jwt';

export const getDataFromToken = async (request: NextRequest) => {
  try {
    // const token = request.cookies.get('token')?.value || ''
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      throw new Error('Token is missing or empty')
    }

    // const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!)

    return token._id;
  } catch (error: any) {
    // Log error for debugging
    console.error('Token error:', error)

    // Handle error gracefully by returning null
    return null // Or you could throw an error with a status if you're sending a response
  }
}
