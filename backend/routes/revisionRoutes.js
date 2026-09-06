import express from 'express';
import { getRevisions, completeRevision } from '../controllers/revisionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getRevisions);
router.post('/:questionId/complete', completeRevision);

export default router;
