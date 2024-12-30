import express from 'express';
import authRouter from './authRoutes.js';
import tableRouter from './tableRoutes.js';

const router = express.Router();

router.use( authRouter);
router.use( tableRouter);

export default router;
