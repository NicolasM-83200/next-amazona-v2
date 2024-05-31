import AdminLayout from '@/components/admin/AdminLayout';
import UserEditForm from './Form';

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Edit User ${params.id}`,
  };
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout activeItem='users'>
      <UserEditForm userId={params.id} />
    </AdminLayout>
  );
}
