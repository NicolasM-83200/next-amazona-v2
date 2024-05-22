'use client';
import { Order } from '@/lib/models/OrderModel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function MyOrders() {
  const router = useRouter();
  const { data: orders, error } = useSWR('/api/orders/mine');

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  if (error) return <p>An error has occured...</p>;
  if (!orders) return <p>Loading...</p>;

  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order._id}>
              <td>{order._id.substring(20, 24)}</td>
              <td>{order.createdAt.toString().substring(0, 10)}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid && order.paidAt
                  ? `${order.paidAt.toString().substring(0, 10)}`
                  : 'Not paid'}
              </td>
              <td>
                {order.isDelivered && order.deliveredAt
                  ? `${order.deliveredAt.toString().substring(0, 10)}`
                  : 'Not delivered'}
              </td>
              <td>
                <Link href={`/order/${order._id}`} passHref>
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
