import { Request, Response, NextFunction } from 'express';
import * as recordService from '../services/record.service';

export const createFinancialRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await recordService.createRecord(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

export const getFinancialRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await recordService.getRecords(req.query);
    res.status(200).json({
      status: 'success',
      results: result.records.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getFinancialRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

export const updateFinancialRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await recordService.updateRecord(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json({
      status: 'success',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFinancialRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await recordService.deleteRecord(req.params.id, req.user.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
