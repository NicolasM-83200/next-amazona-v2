import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name');

  return Response.json(orders);
});
