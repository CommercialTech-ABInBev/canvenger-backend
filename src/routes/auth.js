import { Router } from 'express';
import { AuthController } from '../controller';
import database from '../models';

const router = Router();

const {
    checkGamer,
    addGamer,
    getGamesBoard
} = AuthController;

router.get('/check', checkGamer); //?email=u@u.com&name=uuuuuu 
router.post('/add', addGamer);
router.get('/board', getGamesBoard);

export default router;
