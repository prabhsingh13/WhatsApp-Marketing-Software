// emails/VerifyEmail.tsx
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Text,
    Link,
    Heading,
} from '@react-email/components'

export const VerifyEmail = ({
    username,
    verifyUrl,
}: {
    username: string
    verifyUrl: string
}) => {
    return (
        <Html>
            <Head />
            <Preview>Verify your email, {username}!</Preview>
            <Body style={{ backgroundColor: '#f4f4f4', fontFamily: 'Arial, sans-serif' }}>
                <Container
                    style={{
                        backgroundColor: '#fff',
                        padding: '32px',
                        borderRadius: '12px',
                        maxWidth: '600px',
                        margin: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    }}
                >
                    <Heading style={{ color: '#0f172b' }}>Welcome, {username} 👋</Heading>
                    <Text>Thanks for joining our platform!</Text>
                    <Text>To complete your registration, click the link below:</Text>
                    <Link
                        href={verifyUrl}
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#25D366',
                            color: '#fff',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        ✅ Verify My Email
                    </Link>
                    <Text style={{ marginTop: '20px' }}>
                        If you didn’t request this, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export default VerifyEmail
