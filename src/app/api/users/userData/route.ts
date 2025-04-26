import { getDataFromToken } from '@/helpers/getDataFromToken'
import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/userModel'
import { connect } from '@/dbConfig/dbConfig'

connect()

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { message: 'Token invalid or userId not found' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ _id: userId }).select('-password')
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'User found',
      data: user,
    })
  } catch (error: any) {
    console.error('[GET USER ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
