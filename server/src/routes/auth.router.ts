import express, { Request, Response } from 'express';

import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

const authController = new AuthController;

router.post('/login', async (req: Request, res: Response) => authController.login(req, res));

router.post('/signup', async (req: Request, res: Response) => authController.signUp(req, res));

export default router;