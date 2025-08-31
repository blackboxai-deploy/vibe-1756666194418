import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your RideShare account',
};

export default function SignupPage() {
  return <SignupForm />;
}