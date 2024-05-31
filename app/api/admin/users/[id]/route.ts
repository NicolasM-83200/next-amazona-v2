import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const user = await UserModel.findById(params.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    if (user.isAdmin) {
      return Response.json({ message: 'Cannot delete admin' }, { status: 400 });
    }
    await user.deleteOne();
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
});
