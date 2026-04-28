import express from 'express';
import { checkAuth, login, logout, signup, getAllUsers } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', protectRoute, checkAuth);
router.get('/users', protectRoute, getAllUsers);

export default router;
