import { Request, Response } from 'express';

import { JwtService } from '../services/jwt.service';
import { UserType } from '../db/user';

interface RequestWithUser extends Request {
  user?: UserType;
}

const jwtService = new JwtService();

const authMiddleware = async (req: RequestWithUser, res: Response, next: () => void) => {
  if (typeof req.headers.authorization === 'string') {
    const [_, token] = req.headers.authorization.split(' ');

    const tokenData = await jwtService.verify(token);
    console.log(tokenData);
    if (typeof tokenData !== 'string' && tokenData?.user) {
      req.user = tokenData.user;
      next();
    } else {
      res.status(401).send('unathorized');
      return;
    }
  } else {
    res.status(401).send('unathorized');
  }
};

export default authMiddleware;