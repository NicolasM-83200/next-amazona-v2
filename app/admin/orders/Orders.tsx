'use client';

import { Order } from '@/lib/models/OrderModel';
import Link from 'next/link';
import useSWR from 'swr';

export default function Orders() {
  const { data: orders, error } = useSWR('/api/admin/orders');
  if (error) return <div>{error.message}</div>;
  if (!orders) return <div>Loading...</div>;

  return (
    <>
      <h1 className='py-4 text-2xl'>Orders</h1>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id}>
                <td>..{order._id.substring(20, 24)}</td>
                <td>{order.user?.name || 'Deleted user'}</td>
                <td>{order.createdAt.toString().substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid && order.paidAt
                    ? `${order.paidAt.toString().substring(0, 10)}`
                    : 'Not paid'}
                </td>
                <td>
                  {order.isDelivered && order.deliveredAt
                    ? order.deliveredAt.toString().substring(0, 10)
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
    </>
  );
}
