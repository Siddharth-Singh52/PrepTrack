import express from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  updateProgress,
  updateNotes,
  toggleFavorite,
} from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

// Question progress endpoints
router.put('/:questionId/progress', updateProgress);
router.put('/:questionId/notes', updateNotes);
router.put('/:questionId/favorite', toggleFavorite);

export default router;
