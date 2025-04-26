import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Ensure database connection
connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { email, password } = reqBody

    console.log('Login Request received for', email)

    // Check if user exists
    const user = await User.findOne({ email }).lean() // .lean() to make sure it's a plain JS object
    if (!user || typeof user.password !== 'string') {
      console.log('User not found or password is invalid type')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    console.log('User exists:', user.username)

    // Check password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password)
    if (!isPasswordCorrect) {
      console.log('Incorrect password')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    // Prepare JWT payload
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    }

    // Create JWT token
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: '1d',
    })

    console.log('Generated Token:', token)

    // Prepare response
    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    })

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/', // cookie available everywhere
    })

    console.log('Login successful for', user.username)
    return response
  } catch (error: any) {
    console.error('Login error:', error.message)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
