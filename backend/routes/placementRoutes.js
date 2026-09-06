import express from 'express';
import {
  getPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from '../controllers/placementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getPlacements);
router.post('/', createPlacement);
router.put('/:id', updatePlacement);
router.delete('/:id', deletePlacement);

export default router;
