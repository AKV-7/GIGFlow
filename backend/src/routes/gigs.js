import express from 'express';
import { getGigs, getGig, createGig, deleteGig } from '../controllers/gigController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getGigs)
  .post(protect, createGig);

router.route('/:id')
  .get(getGig)
  .delete(protect, deleteGig);

export default router;
