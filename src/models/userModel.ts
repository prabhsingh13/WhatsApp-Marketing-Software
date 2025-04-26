import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name cannot be empty'],
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    username: {
      type: String,
      required: [true, 'Username cannot be empty'],
      minlength: [3, 'Username must be at least 3 characters long'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email cannot be empty'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password cannot be empty'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      default: 'credentials',
    },
    isUserOnline: {
      type: Boolean,
      default: false, // default offline
    },
    lastOnline: {
      type: Date,
      default: null,
    },
    forgotpasswordToken: String,
    forgotpasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
)

const User = mongoose.models.users || mongoose.model('users', UserSchema)
export default User
