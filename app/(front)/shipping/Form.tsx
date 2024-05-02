'use client';

import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { ShippingAddress } from '@/lib/models/OrderModel';
import { Span } from 'next/dist/trace';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form';

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [shippingAddress, setValue]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push('/payment');
  };

  const FromInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className='mb-2'>
      <label className='label' htmlFor={id}>
        {name}
      </label>
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
  );

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className='card bg-base-300 my-4 max-w-sm mx-auto'>
        <div className='card-body'>
          <h1 className='card-title'>Shipping Address</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <FromInput id='fullName' name='Full Name' required />
            <FromInput id='address' name='Address' required />
            <FromInput id='city' name='City' required />
            <FromInput id='postalCode' name='Postal Code' required />
            <FromInput id='country' name='Country' required />
            <div className='my-2'>
              <button type='submit' className='btn btn-primary w-full'>
                {isSubmitting && (
                  <span className='loading loading-spinner'></span>
                )}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
