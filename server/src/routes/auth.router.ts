import express, { Request, Response } from 'express';
import { ZodError } from 'zod';

import { AuthService } from '../services/auth.service';
import { loginSchema } from '../validationSchemas/auth.validation';

const router = express.Router();

const authService = new AuthService();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { body: { email, password } } = req;

    loginSchema.parse({ email, password });

    const { userData, token } = await authService.login({ email, password });
  
    res.setHeader('Token', token);
  
    res.send(userData);
  } catch (error: unknown) {
    if ((error as Error | ZodError)?.message === 'invalid password') {
      res.status(401);
    } else if ((error as Error | ZodError)?.message === 'user not found') {
      res.status(404);
    } else {
      res.status(400);
    }
    res.send((error as Error | ZodError)?.message ?? error);
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { body: { email, password } } = req;

    const userData = await authService.signup({ email, password });
  
    res.send(userData);
  } catch (error: unknown) {
    res.status(400).send((error as Error)?.message ?? error);
  }
});

export default router;