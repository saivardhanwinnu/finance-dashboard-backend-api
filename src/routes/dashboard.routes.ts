import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';

const router = express.Router();

// Require authentication
router.use(protect);

// Viewer, Analyst, and Admin can all view the dashboard summaries
router.get(
  '/',
  restrictTo('ADMIN', 'ANALYST', 'VIEWER'),
  dashboardController.getDashboardSummary
);

export default router;
