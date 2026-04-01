"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const appError_1 = require("../utils/appError");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new appError_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const currentUser = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!currentUser) {
            return next(new appError_1.AppError('The user belonging to this token no longer exists.', 401));
        }
        if (currentUser.status === 'INACTIVE') {
            return next(new appError_1.AppError('This user is inactive. Please contact admin.', 401));
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
