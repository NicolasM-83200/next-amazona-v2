import { auth } from '@/lib/auth';
import Link from 'next/link';

const AdminLayout = async ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string;
  children: React.ReactNode;
}) => {
  const session = await auth();
  if (!session || !session.user.isAdmin) {
    return (
      <div className='relative flex flex-grow p-4'>
        <div>
          <h1 className='text-2xl'>Unauthorized</h1>
          <p>Admin permission required</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'dashboard' },
    { name: 'orders' },
    { name: 'products' },
    { name: 'users' },
  ];

  return (
    <main className='flex-grow container mx-auto px-4'>
      <div className='md:grid md:grid-cols-5'>
        <div className='bg-base-200'>
          <ul className='menu'>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  className={`${item.name}` === activeItem ? 'active' : ''}
                  href={`/admin/${item.name}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='md:col-span-4'>{children}</div>
      </div>
    </main>
  );
};

export default AdminLayout;
