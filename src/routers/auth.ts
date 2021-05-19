import { Router } from 'express';
import { auth } from '../controllers';

const router = Router();

router.post('/login', auth.login);
router.post('/signup', auth.signup);

export default router;
