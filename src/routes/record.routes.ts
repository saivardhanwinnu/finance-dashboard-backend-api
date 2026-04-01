import express from 'express';
import * as recordController from '../controllers/record.controller';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createRecordSchema,
  updateRecordSchema,
  filterRecordSchema,
} from '../validators/record.validator';

const router = express.Router();

// Require authentication for all record routes
router.use(protect);

router
  .route('/')
  .get(
    restrictTo('ADMIN', 'ANALYST'),
    validate(filterRecordSchema),
    recordController.getFinancialRecords
  )
  .post(
    restrictTo('ADMIN'), // Only admins can create
    validate(createRecordSchema),
    recordController.createFinancialRecord
  );

router
  .route('/:id')
  .get(restrictTo('ADMIN', 'ANALYST'), recordController.getFinancialRecord)
  .patch(
    restrictTo('ADMIN'),
    validate(updateRecordSchema),
    recordController.updateFinancialRecord
  )
  .delete(restrictTo('ADMIN'), recordController.deleteFinancialRecord);

export default router;
