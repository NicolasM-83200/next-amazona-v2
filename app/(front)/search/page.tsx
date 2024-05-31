import ProductItem from '@/components/products/ProductItem';
import Rating from '@/components/products/Rating';
import productService from '@/lib/services/productService';
import Link from 'next/link';

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];
const prices = [
  {
    name: '1$ to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];
const ratings = [5, 4, 3, 2, 1];

export const generateMetadata = async ({
  searchParams: {
    query = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  },
}: {
  searchParams: {
    query: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) => {
  if (
    (query !== 'all' && query !== '') ||
    category !== 'all' ||
    price !== 'all' ||
    rating !== 'all'
  ) {
    return { title: `Search ${query !== 'all' ? query : ''}` };
  } else {
    return { title: 'Search Products' };
  }
};

const SearchPage = async ({
  searchParams: {
    query = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    query: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) => {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { query, category, price, rating, sort, page };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const categories = await productService.getCategories();

  const { countProducts, products, pages } = await productService.getByQuery({
    query,
    category,
    price,
    rating,
    sort,
    page,
  });

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='my-4'>
        <div>
          <h2 className='text-xl'>Departement</h2>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ c: 'all' })}
                className={`link link-hover ${
                  category === 'all' && 'link-primary'
                }`}
              >
                Any
              </Link>
            </li>
            {categories.map((c: string) => (
              <li key={c}>
                <Link
                  href={getFilterUrl({ c })}
                  className={`link link-hover ${
                    category === c && 'link-primary'
                  }`}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='divider'></div>
        <div>
          <h2 className='text-xl'>Price</h2>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ p: 'all' })}
                className={`link link-hover ${
                  price === 'all' && 'link-primary'
                }`}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`link link-hover ${
                    price === p.value && 'link-primary'
                  }`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='divider'></div>
        <div>
          <h2 className='text-xl'>Customer Review</h2>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={`link link-hover ${
                  rating === 'all' && 'link-primary'
                }`}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`link link-hover ${
                    rating === `${r}` && 'link-primary'
                  }`}
                >
                  <Rating caption={' & up'} value={r} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='md:col-span-4'>
        <div className='flex flex-col items-start justify-between mb-4'>
          <div className='flex items-center'>
            {products.length === 0 ? 'No' : countProducts} Results
            {query !== 'all' && query !== '' && ' : ' + query}
            {category !== 'all' && ' : ' + category}
            {price !== 'all' && ' : Price ' + price}
            {rating !== 'all' && ' : Rating ' + rating}
            &nbsp;
            {(query !== 'all' && query !== '') ||
            category !== 'all' ||
            price !== 'all' ||
            rating !== 'all' ? (
              <Link href='/search' className='btn btn-sm btn-ghost'>
                Clear
              </Link>
            ) : null}
          </div>

          <div>
            Sort by{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                href={getFilterUrl({ s })}
                className={`mx-2 link link-hover ${
                  sort == s ? 'link-primary' : ''
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className='my-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {products.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
          <div className='join'>
            {products.length > 0 &&
              Array.from(Array(pages).keys()).map((p) => (
                <Link
                  key={p}
                  className={`join-item btn ${
                    Number(page) === p + 1 ? 'btn-active' : ''
                  }`}
                  href={getFilterUrl({ pg: `${p + 1}` })}
                >
                  {p + 1}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
