import { Router } from 'express';
import { login, register, refresh } from '../controllers/AuthController.js';
import passport from '../middleware/passport.js';

const router = Router();

router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.post('/api/auth/refresh', passport.authenticate('jwt', { session: false }), (req, res) => refresh(req, res));

export default router;