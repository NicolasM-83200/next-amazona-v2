import { cache } from 'react';
import dbConnect from '@/lib/dbConnect';
import ProductModel, { Product } from '../models/ProductModel';

export const revalidate = 3600;

const PAGE_SIZE = 3;
const getByQuery = cache(
  async ({
    query,
    category,
    sort,
    price,
    rating,
    page = '1',
  }: {
    query: string;
    category: string;
    sort: string;
    price: string;
    rating: string;
    page: string;
  }) => {
    await dbConnect();

    const queryFilter =
      query && query !== 'all'
        ? { name: { $regex: query, $options: 'i' } }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };

    const categories = await ProductModel.find().distinct('category');
    const products = await ProductModel.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter,
      },
      '-reviews'
    )
      .sort(order)
      .skip((Number(page) - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...ratingFilter,
      ...priceFilter,
    });

    return {
      products: products as Product[],
      countProducts,
      categories,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    };
  }
);

const getLatest = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(4)
    .lean();
  return products as Product[];
});

const getFeatured = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true })
    .limit(3)
    .lean();
  return products as Product[];
});

const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();
  return product as Product;
});

const getCategories = cache(async () => {
  await dbConnect();
  const categories = await ProductModel.find().distinct('category');
  return categories;
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
};

export default productService;
