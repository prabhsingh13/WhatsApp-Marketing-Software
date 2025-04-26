// utils/sendEmail.ts
import { render } from '@react-email/render'
import axios from 'axios'
import { VerifyEmail } from '@/emails/VerifyEmail'

type EmailType = 'VERIFY' | 'RESET' | 'WELCOME'

export const sendEmail = async ({
  email,
  emailType,
  userId,
  username = 'User',
}: {
  email: string
  emailType: EmailType
  userId: string
  username?: string
}) => {
  try {
    const mailersendApiKey = process.env.MAILERSEND_API_KEY
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    if (!mailersendApiKey) throw new Error('Mailersend API key is missing.')

    let subject = ''
    let html = ''
    let url = ''

    if (emailType === 'VERIFY') {
      subject = 'Verify Your Email'
      const verifyToken = 'RANDOM_VERIFY_TOKEN'
      url = `${baseUrl}/verify-email?token=${verifyToken}&userId=${userId}`
      html = render(<VerifyEmail username={username} verifyUrl={url} />)
    }

    // You can add RESET and WELCOME templates similarly

    const response = await axios.post(
      'https://api.mailersend.com/v1/email',
      {
        from: {
          email: 'psinstacommunity@gmail.com',
          name: 'PS Creative Media',
        },
        to: [{ email }],
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${mailersendApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('✅ Email sent successfully:', response.data)
    return response.data
  } catch (err: any) {
    console.error('❌ Error sending email:', err?.response?.data || err.message)
    throw new Error('Error sending email.')
  }
}
