"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = require("../config/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const signToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '90d',
    });
};
const registerUser = async (data) => {
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
    const newUser = await prisma_1.prisma.user.create({
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
exports.registerUser = registerUser;
const loginUser = async (data) => {
    if (!data.email || !data.password) {
        throw new appError_1.AppError('Please provide email and password!', 400);
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user || !(await bcryptjs_1.default.compare(data.password, user.password))) {
        throw new appError_1.AppError('Incorrect email or password', 401);
    }
    if (user.status === 'INACTIVE') {
        throw new appError_1.AppError('User is inactive or suspended', 403);
    }
    const token = signToken(user.id, user.role);
    user.password = ''; // exclude password
    return { user, token };
};
exports.loginUser = loginUser;
const getAllUsers = async () => {
    return prisma_1.prisma.user.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
};
exports.getAllUsers = getAllUsers;
