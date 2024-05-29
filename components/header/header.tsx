import Link from 'next/link';
import React from 'react';
import Menu from './Menu';

const Header = () => {
  return (
    <header>
      <nav>
        <div className='navbar justify-between bg-base-300'>
          <div>
            <label htmlFor='my-drawer' className='btn btn-square btn-ghost'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='inline-block w-5 h-5 stroke-current'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M4 6h16M4 12h16M4 18h16'
                ></path>
              </svg>
            </label>
            <Link href='/' className='btn btn-ghost text-lg'>
              Next Amazona
            </Link>
          </div>
          <Menu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
