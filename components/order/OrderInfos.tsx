import useCartService from '@/lib/hooks/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const OrderInfos = ({
  placeOrder,
  isPlacing,
  data,
}: {
  placeOrder?: () => void;
  isPlacing?: boolean;
  data?: {
    items: {
      name: string;
      image: string;
      price: number;
      qty: number;
      slug: string;
      color: string;
      size: string;
    }[];
    isDelivered: boolean;
    deliveredAt: string;
    isPaid: boolean;
    paidAt: string;
  };
}) => {
  const pathname = usePathname();
  const {
    shippingAddress,
    paymentMethod,
    items: cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCartService();

  let items, isDelivered, deliveredAt, isPaid, paidAt;
  if (data) {
    ({ items, isDelivered, deliveredAt, isPaid, paidAt } = data);
  }

  return (
    <div className='grid md:grid-cols4 md:gap-5 md:max-w-lg mx-auto my-4'>
      <div className='overflow-x-auto md:col-span-3 space-y-4'>
        <div className='card bg-base-300'>
          <div className='card-body'>
            <h2 className='card-title'>Shipping Address</h2>
            <p>{shippingAddress.fullName}</p>
            <p>
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}{' '}
            </p>
            {pathname === '/place-order' ? (
              <div>
                <Link className='btn' href='/shipping'>
                  Edit
                </Link>
              </div>
            ) : isDelivered ? (
              <div className='text-success'>Delivered at {deliveredAt}</div>
            ) : (
              <div className='text-error'>Not Delivered</div>
            )}
          </div>
        </div>
        <div className='card bg-base-300'>
          <div className='card-body'>
            <h2 className='card-title'>Payment Method</h2>
            <p>{paymentMethod}</p>
            {pathname === '/place-order' ? (
              <div>
                <Link className='btn' href='/payment'>
                  Edit
                </Link>
              </div>
            ) : isPaid ? (
              <div className='text-success'>Paid at {paidAt}</div>
            ) : (
              <div className='text-error'>Not Paid</div>
            )}
          </div>
        </div>
        <div className='card bg-base-300'>
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
                {/* items from useCartService */}
                {cartItems.map((item) => (
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
                {/* items from data */}
                {items &&
                  items.map((item) => (
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
            {pathname === '/place-order' && (
              <div>
                <Link className='btn' href='/cart'>
                  Edit
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className='card bg-base-300'>
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
              {pathname === '/place-order' && (
                <li>
                  <button
                    className='btn btn-primary w-full'
                    onClick={() => placeOrder && placeOrder()}
                    disabled={isPlacing}
                  >
                    {isPlacing && (
                      <span className='loading loading-spinner'></span>
                    )}
                    Place Order
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfos;
