"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRecordSchema = exports.updateRecordSchema = exports.createRecordSchema = void 0;
const zod_1 = require("zod");
exports.createRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive('Amount must be positive'),
        type: zod_1.z.enum(['INCOME', 'EXPENSE']),
        category: zod_1.z.string().min(1, 'Category is required'),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        }),
        notes: zod_1.z.string().optional(),
    }),
});
exports.updateRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive('Amount must be positive').optional(),
        category: zod_1.z.string().min(1).optional(),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        }).optional(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.filterRecordSchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z.enum(['INCOME', 'EXPENSE']).optional(),
        category: zod_1.z.string().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
    }),
});
