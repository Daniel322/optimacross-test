import express, { Request, Response } from 'express';
import User from '../db/user';

const sessionChecker = async (req: Request, res: Response, next: () => void) => {
  console.log(req.session);
  //@ts-ignore
  if (req.session.user) {
    //@ts-ignore
    const currentUser = await User.findById(req.session.user._id);

    if (!currentUser) {
      res.status(401).send('unathorized');
      return;
    }
    next();
  } else {
    res.status(401).send('unathorized');
    return;
  }
};

export default sessionChecker;