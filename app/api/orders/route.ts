import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel, { OrderItem } from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import { round2 } from '@/lib/utils';

const calcPrices = (orderItems: OrderItem[]) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { user } = req.auth;
  try {
    const payload = await req.json();
    await dbConnect();
    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((p: { _id: string }) => p._id) },
      },
      'price'
    );
    const dbOrderItems = payload.items.map((p: { _id: string }) => ({
      price: dbProductPrices.find((p) => p._id === p._id).price,
      product: p._id,
      ...p,
      _id: undefined,
    }));

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    });

    const createdOrder = await newOrder.save();
    return Response.json(
      {
        message: 'Order has been created',
        order: createdOrder,
        dbProductPrices: dbProductPrices,
        dbOrderItems: dbOrderItems,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
});
