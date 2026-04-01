"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordById = exports.getRecords = exports.deleteRecord = exports.updateRecord = exports.createRecord = void 0;
const prisma_1 = require("../config/prisma");
const appError_1 = require("../utils/appError");
const createRecord = async (userId, data) => {
    const record = await prisma_1.prisma.financialRecord.create({
        data: {
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
            notes: data.notes,
            userId: userId,
        },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            action: 'RECORD_CREATED',
            entityId: record.id,
            metadata: JSON.stringify(record),
            userId: userId,
        },
    });
    return record;
};
exports.createRecord = createRecord;
const updateRecord = async (recordId, userId, data) => {
    const existingRecord = await prisma_1.prisma.financialRecord.findUnique({
        where: { id: recordId },
    });
    if (!existingRecord || existingRecord.deletedAt) {
        throw new appError_1.AppError('Record not found', 404);
    }
    const updatedData = { ...data };
    if (data.date)
        updatedData.date = new Date(data.date);
    const updatedRecord = await prisma_1.prisma.financialRecord.update({
        where: { id: recordId },
        data: updatedData,
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            action: 'RECORD_UPDATED',
            entityId: updatedRecord.id,
            metadata: JSON.stringify(updatedRecord),
            userId: userId,
        },
    });
    return updatedRecord;
};
exports.updateRecord = updateRecord;
const deleteRecord = async (recordId, userId) => {
    const existingRecord = await prisma_1.prisma.financialRecord.findUnique({
        where: { id: recordId },
    });
    if (!existingRecord || existingRecord.deletedAt) {
        throw new appError_1.AppError('Record not found', 404);
    }
    const deletedRecord = await prisma_1.prisma.financialRecord.update({
        where: { id: recordId },
        data: { deletedAt: new Date() },
    });
    await prisma_1.prisma.auditLog.create({
        data: {
            action: 'RECORD_DELETED',
            entityId: deletedRecord.id, // Soft Delete
            metadata: JSON.stringify({ deletedAt: deletedRecord.deletedAt }),
            userId: userId,
        },
    });
    return deletedRecord;
};
exports.deleteRecord = deleteRecord;
const getRecords = async (queryFilters) => {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = queryFilters;
    const filters = {
        deletedAt: null,
    };
    if (type)
        filters.type = type;
    if (category)
        filters.category = { contains: category };
    if (startDate && endDate) {
        filters.date = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }
    else if (startDate) {
        filters.date = { gte: new Date(startDate) };
    }
    else if (endDate) {
        filters.date = { lte: new Date(endDate) };
    }
    const pageNum = parseInt(page, 10);
    const skipAmt = (pageNum - 1) * parseInt(limit, 10);
    const records = await prisma_1.prisma.financialRecord.findMany({
        where: filters,
        skip: skipAmt,
        take: parseInt(limit, 10),
        orderBy: { date: 'desc' },
    });
    const total = await prisma_1.prisma.financialRecord.count({ where: filters });
    return {
        records,
        pagination: {
            total,
            page: pageNum,
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(total / parseInt(limit, 10)),
        },
    };
};
exports.getRecords = getRecords;
const getRecordById = async (recordId) => {
    const record = await prisma_1.prisma.financialRecord.findUnique({
        where: { id: recordId },
    });
    if (!record || record.deletedAt) {
        throw new appError_1.AppError('Record not found', 404);
    }
    return record;
};
exports.getRecordById = getRecordById;
