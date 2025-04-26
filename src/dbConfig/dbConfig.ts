import mongoose from 'mongoose'

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('Database Connected Successfully!')
    })
    connection.on('error', (err) => {
      console.log('Database Connection Failed!')
      console.log(err)
      process.exit()
    })
    connection.on('disconnected', () => {
      console.log('Database Disconnected!')
    })
    connection.on('reconnected', () => {
      console.log('Database Reconnected!')
    })
  } catch (err) {
    console.log('Something went wrong while connecting to the database!')
    console.log(err)
  } finally {
  }
}
