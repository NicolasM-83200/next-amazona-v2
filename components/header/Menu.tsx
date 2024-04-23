'use client';
import { useEffect, useState } from 'react';
import useCartService from '@/lib/hooks/useCartStore';
import Link from 'next/link';

const Menu = () => {
  const { items } = useCartService();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <ul className='flex items-stretch'>
        <li>
          <Link href='/cart' className='btn btn-ghost rounded-btn'>
            Cart
            {mounted && items.length > 0 && (
              <span className='badge badge-secondary'>
                {items.reduce((a, c) => a + c.qty, 0)}{' '}
              </span>
            )}
          </Link>
        </li>
        <li>
          <button className='btn btn-ghost rounded-btn' type='button'>
            Sign In
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
