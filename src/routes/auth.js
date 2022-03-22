import { Router } from 'express';
import { AuthController } from '../controller';
import database from '../models';

const router = Router();

const {
    checkGamer,
    addGamer,
    getGamesBoard
} = AuthController;

router.get('/check', checkGamer);
router.post('/add', addGamer);
router.get('/board', getGamesBoard);

export default router;
