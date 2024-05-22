import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import UserModel from '@/lib/models/UserModel';

export const PUT = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { user } = req.auth;
  const { name, email, password } = await req.json();
  await dbConnect();

  try {
    const dbUser = await UserModel.findById(user._id);
    if (!dbUser) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }
    dbUser.name = name;
    dbUser.email = email;
    dbUser.password = password
      ? await bcrypt.hash(password, 10)
      : dbUser.password;
    await dbUser.save();
    return Response.json({ message: 'User has been updated' });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
});
