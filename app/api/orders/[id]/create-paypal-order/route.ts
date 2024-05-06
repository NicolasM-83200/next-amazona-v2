import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { paypal } from '@/lib/paypal';

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const order = await OrderModel.findById(params.id);
  if (!order) {
    return Response.json({ error: 'Order not found' }, { status: 404 });
  }
  try {
    const paypalOrder = await paypal.createOrder(order.totalPrice);
    return Response.json(paypalOrder);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
