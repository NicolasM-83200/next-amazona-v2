'use client';
import { OrderItem } from '@/lib/models/OrderModel';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string;
  paypalClientId: string;
}) {
  const { data: session } = useSession();

  const createPaypalOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/create-paypal-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const order = await res.json();
      return order.id;
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  const onApprovePaypalOrder = async (data: any) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/capture-paypal-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const orderData = await res.json();
      toast.success('Order paid successfully');
      return orderData;
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) {
    return error.message;
  }
  if (!data) {
    return 'Loading...';
  }

  const {
    shippingAddress,
    paymentMethod,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = data;

  return (
    <div>
      <h1 className='text-2xl py-4'>Order {orderId}</h1>
      <div className='grid md:grid-cols-4 md:gap-5 mt-4'>
        <div className='md:col-span-3'>
          <div className='card bg-base-300 mb-4'>
            <div className='card-body'>
              <h2 className='card-title'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className='text-success'>Delivered at {deliveredAt}</div>
              ) : (
                <div className='text-error'>Not Delivered</div>
              )}
            </div>
          </div>
          <div className='card bg-base-300 mb-4'>
            <div className='card-body'>
              <h2 className='card-title'>Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className='text-success'>Paid at {paidAt}</div>
              ) : (
                <div className='text-error'>Not Paid</div>
              )}
            </div>
          </div>
          <div className='card bg-base-300 mb-4'>
            <div className='card-body'>
              <h2 className='card-title'>Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className='px-2'>
                            {item.name}({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='card bg-base-300 mb-4'>
          <div className='card-body'>
            <h2 className='card-title'>Order Summary</h2>
            <ul className='space-y-3'>
              <li>
                <div className='flex justify-between'>
                  <div>Items</div>
                  <div>${itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className='flex justify-between'>
                  <div>Shipping</div>
                  <div>${shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className='flex justify-between'>
                  <div>Tax</div>
                  <div>${taxPrice}</div>
                </div>
              </li>
              <li>
                <div className='flex justify-between'>
                  <div>Total</div>
                  <div>${totalPrice}</div>
                </div>
              </li>

              {!isPaid && paymentMethod === 'PayPal' && (
                <li>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      createOrder={createPaypalOrder}
                      onApprove={onApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
