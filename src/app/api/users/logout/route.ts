import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    })

    // Clear the token cookie by setting it to empty and expired
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Expire immediately
    })

    return response
  } catch (error: any) {
    console.error('Logout error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
