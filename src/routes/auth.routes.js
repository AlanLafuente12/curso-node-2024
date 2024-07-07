import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.route('/')
    .get(authController.login);

export default router;