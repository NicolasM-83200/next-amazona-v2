'use client';
import CheckoutSteps from '@/components/CheckoutSteps';
import OrderInfos from '@/components/order/OrderInfos';
import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWRMutation from 'swr/mutation';

const From = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clearCart,
  } = useCartService();

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    'api/orders/mine',
    async (url) => {
      const res = await fetch('api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        toast.success('Order placed successfully');
        return router.push(`/order/${data.order._id}`);
      } else {
        return toast.error(data.message);
      }
    }
  );

  useEffect(() => {
    if (!paymentMethod) {
      return router.push('/payment');
    }
    if (items.length === 0) {
      return router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  console.log(pathname);

  return (
    <div>
      <CheckoutSteps current={4} />
      <OrderInfos placeOrder={placeOrder} isPlacing={isPlacing} />
    </div>
  );
};

export default From;
