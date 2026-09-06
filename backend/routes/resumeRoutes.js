import express from 'express';
import { analyzeResumeFile, getResumeHistory } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', upload.single('resume'), analyzeResumeFile);
router.get('/history', getResumeHistory);

export default router;
