import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
import Providers from '@/components/Providers';
import Footer from '@/components/footer/Footer';
import DrawerButton from '@/components/DrawerButton';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Amazona v2',
  description: 'Modern e-commerce website built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <div className='drawer'>
            <DrawerButton />
            <div className='drawer-content'>
              {/* Page content here */}
              <div className='min-h-screen flex flex-col'>
                <Header />
                {children}
                <Footer />
              </div>
            </div>
            <div className='drawer-side'>
              <label
                htmlFor='my-drawer'
                aria-label='close sidebar'
                className='drawer-overlay'
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
