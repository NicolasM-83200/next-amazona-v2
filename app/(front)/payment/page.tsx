import { Metadata } from 'next';
import Form from './Form';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default async function PaymentPage() {
  return <Form />;
}
