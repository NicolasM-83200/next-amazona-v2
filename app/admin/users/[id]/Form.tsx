'use client';

import { User } from '@/lib/models/UserModel';
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ValidationRule, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function UserEditForm({ userId }: { userId: string }) {
  const { data: user, error } = useSWR(`/api/admin/users/${userId}`);
  const router = useRouter();

  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message);
      }
      toast.success('User updated successfully');
      router.push('/admin/users');
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<User>();

  useEffect(() => {
    if (!user) return;
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('isAdmin', user.isAdmin);
  }, [user, setValue]);

  const formSubmit = async (formData: any) => {
    await updateUser(formData);
  };

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof User;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className='md:flex my-3'>
      <label htmlFor={id} className='label md:w-1/5'>
        {name}
      </label>
      <div className='md:w-4/5'>
        <input
          type='text'
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className='input input-bordered w-full max-w-sm'
        />
        {errors[id]?.message && (
          <div className='text-error'>{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className='my-4'>
      <h1 className='py-4 text-2xl'>Edit User {formatId(userId)}</h1>
      <form onSubmit={handleSubmit(formSubmit)}>
        <FormInput id='name' name='Name' required />
        <FormInput id='email' name='Email' required />

        <div className='md:flex my-3'>
          <label htmlFor='isAdmin' className='label md:w-1/5'>
            Admin
          </label>
          <div className='md:w-4/5'>
            <input
              type='checkbox'
              id='isAdmin'
              {...register('isAdmin')}
              className='toggle'
            />
          </div>
        </div>

        <button className='btn btn-primary' type='button' disabled={isUpdating}>
          {isUpdating && <span className='loading loading-spinner'></span>}
          Update
        </button>

        <Link className='btn ml-4' href={'/admin/users'}>
          Cancel
        </Link>
      </form>
    </div>
  );
}
