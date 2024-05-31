'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

export const SearchBox = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';

  const { data: categories, error } = useSWR('/api/products/categories');

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <form action='/search' method='GET'>
      <div className='join'>
        <select
          name='category'
          defaultValue={category}
          className='join-item select select-bordered'
        >
          <option value='all'>All</option>
          {categories.map((category: string) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          className='join-item input input-bordered w-48'
          placeholder='Search'
          defaultValue={query}
          name='query'
        />
        <button className='join-item btn'>Search</button>
      </div>
    </form>
  );
};

export default SearchBox;
