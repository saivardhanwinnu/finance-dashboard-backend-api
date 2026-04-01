import { prisma } from '../config/prisma';
import { AppError } from '../utils/appError';

export const createRecord = async (userId: string, data: any) => {
  const record = await prisma.financialRecord.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes,
      userId: userId,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'RECORD_CREATED',
      entityId: record.id,
      metadata: JSON.stringify(record),
      userId: userId,
    },
  });

  return record;
};

export const updateRecord = async (
  recordId: string,
  userId: string,
  data: any
) => {
  const existingRecord = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!existingRecord || existingRecord.deletedAt) {
    throw new AppError('Record not found', 404);
  }

  const updatedData: any = { ...data };
  if (data.date) updatedData.date = new Date(data.date);

  const updatedRecord = await prisma.financialRecord.update({
    where: { id: recordId },
    data: updatedData,
  });

  await prisma.auditLog.create({
    data: {
      action: 'RECORD_UPDATED',
      entityId: updatedRecord.id,
      metadata: JSON.stringify(updatedRecord),
      userId: userId,
    },
  });

  return updatedRecord;
};

export const deleteRecord = async (recordId: string, userId: string) => {
  const existingRecord = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!existingRecord || existingRecord.deletedAt) {
    throw new AppError('Record not found', 404);
  }

  const deletedRecord = await prisma.financialRecord.update({
    where: { id: recordId },
    data: { deletedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      action: 'RECORD_DELETED',
      entityId: deletedRecord.id, // Soft Delete
      metadata: JSON.stringify({ deletedAt: deletedRecord.deletedAt }),
      userId: userId,
    },
  });

  return deletedRecord;
};

export const getRecords = async (queryFilters: any) => {
  const { type, category, startDate, endDate, page = 1, limit = 10 } = queryFilters;

  const filters: any = {
    deletedAt: null,
  };

  if (type) filters.type = type;
  if (category) filters.category = { contains: category };
  if (startDate && endDate) {
    filters.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  } else if (startDate) {
    filters.date = { gte: new Date(startDate) };
  } else if (endDate) {
    filters.date = { lte: new Date(endDate) };
  }

  const pageNum = parseInt(page as string, 10);
  const skipAmt = (pageNum - 1) * parseInt(limit as string, 10);

  const records = await prisma.financialRecord.findMany({
    where: filters,
    skip: skipAmt,
    take: parseInt(limit as string, 10),
    orderBy: { date: 'desc' },
  });

  const total = await prisma.financialRecord.count({ where: filters });

  return {
    records,
    pagination: {
      total,
      page: pageNum,
      limit: parseInt(limit as string, 10),
      totalPages: Math.ceil(total / parseInt(limit as string, 10)),
    },
  };
};

export const getRecordById = async (recordId: string) => {
  const record = await prisma.financialRecord.findUnique({
    where: { id: recordId },
  });

  if (!record || record.deletedAt) {
    throw new AppError('Record not found', 404);
  }

  return record;
};
