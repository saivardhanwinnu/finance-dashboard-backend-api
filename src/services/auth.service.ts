import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '90d',
  });
};

export const registerUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'VIEWER',
    },
  });

  const token = signToken(newUser.id, newUser.role);
  newUser.password = ''; // exclude password from output

  return { user: newUser, token };
};

export const loginUser = async (data: any) => {
  if (!data.email || !data.password) {
    throw new AppError('Please provide email and password!', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  if (user.status === 'INACTIVE') {
    throw new AppError('User is inactive or suspended', 403);
  }

  const token = signToken(user.id, user.role);
  user.password = ''; // exclude password

  return { user, token };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });
};
