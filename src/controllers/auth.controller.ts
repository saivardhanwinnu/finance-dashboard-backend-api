import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({
      status: 'success',
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};
