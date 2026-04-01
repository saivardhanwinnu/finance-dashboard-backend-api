import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await dashboardService.getDashboardSummary();
    res.status(200).json({
      status: 'success',
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};
