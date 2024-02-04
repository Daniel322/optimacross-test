import express, { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { loginSchema } from '../validationSchemas/auth.validation';
import { extractErrorMessage } from '../utils';

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
    const message = extractErrorMessage(error);
    if (message === 'Try again later') {
      return res.status(400).send(error);
    } else if (message === 'user not found') {
      res.status(404);
    } else {
      res.status(400);
    }

    return res.send(message);
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { body: { email, password } } = req;

    const userData = await authService.signup({ email, password });
  
    res.send(userData);
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    if (message === 'Try again later') {
      return res.status(400).send(error);
    } else {
      return res.status(400).send(message);
    }
  }
});

export default router;