import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const user = await UserModel.findById(params.id);
  if (!user) {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }
  return Response.json(user);
});

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, isAdmin } = await req.json();

  try {
    await dbConnect();
    const user = await UserModel.findById(params.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    user.name = name;
    user.email = email;
    user.isAdmin = isAdmin;

    const updatedUser = await user.save();
    return Response.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
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
