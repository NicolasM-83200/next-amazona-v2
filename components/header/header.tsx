import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <header>
      <nav>
        <div className='navbar justify-between bg-base-300'>
          <Link href='/' className='btn btn-ghost text-lg'>
            Next Amazona V2
          </Link>
          <ul className='flex'>
            <li>
              <Link href='/cart' className='btn btn-ghost rounded-btn'>
                Cart
              </Link>
            </li>
            <li>
              <Link href='/singin' className='btn btn-ghost rounded-btn'>
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
