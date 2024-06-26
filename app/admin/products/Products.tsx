'use client';

import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export default function Products() {
  const { data: products, error } = useSWR('/api/admin/products');
  const router = useRouter();

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...');
      const res = await fetch(`/api/admin/products/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Product deleted successfully', { id: toastId })
        : toast.error(data.message, { id: toastId });
    }
  );

  const { trigger: createdProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const res = await fetch(`/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message);
      }
      toast.success('Product created successfully');
      router.push(`/admin/products/${data.product._id}`);
    }
  );

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='py-4 text-2xl'>Products</h1>
        <button
          className='btn btn-primary btn-sm'
          disabled={isCreating}
          onClick={() => createdProduct()}
        >
          {isCreating && <span className='loading loading-spinner'></span>}
          Create
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='table table-zebra'>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>price</th>
              <th>category</th>
              <th>count in stock</th>
              <th>rating</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product._id}>
                <td>{formatId(product._id!)}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.countInStock}</td>
                <td>{product.rating}</td>
                <td>
                  <Link
                    href={`/admin/products/${product._id}`}
                    className='btn btn-link btn-sm'
                  >
                    Edit
                  </Link>
                  &nbsp;
                  <button
                    type='button'
                    className='btn btn-ghost btn-sm'
                    onClick={() => {
                      confirm('Are you sure you want to delete this product?')
                        ? deleteProduct({ productId: product._id! })
                        : null;
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
