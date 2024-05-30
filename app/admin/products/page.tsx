import AdminLayout from '@/components/admin/AdminLayout';
import Products from './Products';

export const metadata = {
  title: 'Admin Products',
};

const AdminProductPage = () => {
  return (
    <AdminLayout activeItem='products'>
      <Products />
    </AdminLayout>
  );
};

export default AdminProductPage;
