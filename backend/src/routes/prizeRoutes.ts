import { Router } from 'express';
import {
  getPrizes,
  getPrizeById,
  createPrize,
  updatePrize,
  deletePrize
} from '../controllers/prizeController';

const router = Router();

// Rutas para premios
router.get('/', getPrizes);
router.get('/:id', getPrizeById);
router.post('/', createPrize);
router.put('/:id', updatePrize);
router.delete('/:id', deletePrize);

export default router; 