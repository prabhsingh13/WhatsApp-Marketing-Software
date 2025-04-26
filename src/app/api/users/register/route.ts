import { connect } from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
// import { sendEmail } from '@/helpers/mailer'
import jwt from 'jsonwebtoken' // Import JWT package

connect()

export async function POST(request: NextRequest) {
  try {
    const { fullName, username, email, password } = await request.json()

    // 1. Field Required Check
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // 2. Email, Username, Password format validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Username must be at least 3 characters, alphanumeric (underscores allowed)',
        },
        { status: 400 }
      )
    }

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      )
    }

    // 3. Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      )
    }

    // 4. Hash Password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // 5. Optional Avatar (like your old version)
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=random&bold=true&format=png`

    // 6. Generate Verification Token using JWT
    const verifyToken = jwt.sign(
      { email: email.toLowerCase() }, // Payload with the email
      process.env.JWT_SECRET_KEY!, // Secret key for signing the token
      { expiresIn: '1h' } // Expiry time set to 1 hour
    )

    // 7. Create and Save User
    const newUser = new User({
      name: fullName,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: avatarUrl,
      provider: 'credentials',
      forgotpasswordToken: null, // No token at registration
      forgotpasswordTokenExpiry: null, // No expiry at registration
      verifyToken, // Store the JWT verify token
      verifyTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry date
      isVerified: false, // Set the user as not verified
    })

    const savedUser = await newUser.save()

    // // 8. Send Verification Email
    // await sendEmail({
    //   email,
    //   emailType: 'VERIFY',
    //   userId: savedUser._id,
    //   verifyToken,
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email.',
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          username: savedUser.username,
          email: savedUser.email,
          image: savedUser.image,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Register API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
