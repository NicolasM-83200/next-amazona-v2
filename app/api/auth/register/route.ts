import dbConnect from '@/lib/dbConnect';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs'; // Import bcrypt from bcryptjs
import UserModel from '@/lib/models/UserModel';

export const POST = async (req: NextRequest) => {
  const { email, name, password } = await req.json();

  await dbConnect();

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new UserModel({
    email,
    name,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return Response.json({ message: 'User created' }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
