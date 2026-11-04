import {
  Html,
  Head,
  Preview,
  Heading,
  Text,
  Tailwind,
  Body,
  Container,
  Hr,
} from "react-email";

interface VerificationEmailProps {
  username: string;
  otp: string;
  expiresIn?: string;
}

export default function VerificationEmail({
  username,
  otp,
  expiresIn = "5 minutes",
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your email address</Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-12 px-4 max-w-xl">
            <Text className="text-2xl font-bold text-black">icl</Text>

            <Heading className="text-2xl font-bold text-gray-900 mt-8">
              Hi {username},
            </Heading>

            <Text className="text-base text-gray-700 leading-6">
              Thanks for registering! Please use the below OTP for verifying
              your email
            </Text>

            <Text className="bg-black text-white px-6 py-3 rounded-md font-medium mt-4 inline-block box-border">
              {otp}
            </Text>

            <Text className="text-sm text-gray-500 mt-4">
              This OTP will expire in {expiresIn}.
            </Text>

            <Hr className="border-gray-200 my-8" />

            <Text className="text-sm text-gray-500">
              If you didn&apos;t request this verification, you can safely
              ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
