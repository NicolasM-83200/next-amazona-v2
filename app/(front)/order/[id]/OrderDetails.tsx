'use client';
import OrderInfos from '@/components/order/OrderInfos';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string;
  paypalClientId: string;
}) {
  const { data: session } = useSession();
  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) {
    return error.message;
  }
  if (!data) {
    return 'Loading...';
  }

  return (
    <div>
      <h1 className='text-2xl py-4'>Order {orderId}</h1>
      <OrderInfos data={data} />
    </div>
  );
}
