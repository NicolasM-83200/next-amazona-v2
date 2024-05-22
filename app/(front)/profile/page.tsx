import { Metadata } from 'next';
import Form from './Form';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Profile() {
  return (
    <>
      <h2 className='text-2xl py-2'>Profile</h2>
      <Form />
    </>
  );
}
