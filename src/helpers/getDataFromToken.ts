import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get('token')?.value || ''
    if (!token) {
      throw new Error('Token is missing or empty')
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!)

    return decodedToken.id
  } catch (error: any) {
    // Log error for debugging
    console.error('Token error:', error)

    // Handle error gracefully by returning null
    return null // Or you could throw an error with a status if you're sending a response
  }
}
