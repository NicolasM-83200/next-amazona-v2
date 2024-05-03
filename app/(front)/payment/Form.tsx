'use client';

import CheckoutSteps from '@/components/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Form = () => {
  const router = useRouter();
  const { savePaymentMethod, paymentMethod, shippingAddress } =
    useCartService();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || 'PayPal');
  }, [paymentMethod, shippingAddress.address, router]);

  return (
    <div>
      <CheckoutSteps current={2} />
      <div className='max-w-sm mx-auto card bg-base-300 my-4'>
        <div className='card-body'>
          <h1 className='card-title'>Payment Method</h1>
          <form onSubmit={handleSubmit}>
            {['PayPal', 'Stripe', 'CashOnDelivery'].map((method) => (
              <div key={method}>
                <label className='label cursor-pointer'>
                  <span className='label-text'>{method}</span>
                  <input
                    type='radio'
                    name='paymentMethod'
                    className='radio'
                    value={method}
                    checked={selectedPaymentMethod === method}
                    onChange={() => setSelectedPaymentMethod(method)}
                  />
                </label>
              </div>
            ))}
            <div className='my-2'>
              <button type='submit' className='btn btn-primary w-full'>
                Next
              </button>
            </div>
            <div className='my-2'>
              <button className='my-2 btn w-full' onClick={() => router.back()}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
