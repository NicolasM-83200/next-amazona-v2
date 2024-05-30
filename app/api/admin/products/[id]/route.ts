import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const product = await ProductModel.findById(params.id);
  if (!product) {
    return Response.json({ message: 'Product not found' }, { status: 404 });
  }
  return Response.json(product);
});

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const {
    name,
    slug,
    image,
    price,
    category,
    brand,
    countInStock,
    description,
  } = await req.json();

  try {
    await dbConnect();
    const product = await ProductModel.findById(params.id);
    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    product.name = name;
    product.slug = slug;
    product.image = image;
    product.price = price;
    product.category = category;
    product.brand = brand;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();
    return Response.json(updatedProduct);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
});

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await ProductModel.findById(params.id);
    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }
    await product.deleteOne();
    return Response.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
});
