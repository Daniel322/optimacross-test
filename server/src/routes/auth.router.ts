import express, { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../db/user';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { body: { email, password }, session } = req;

  console.log(email, password);

  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    res.status(404).send('user not found');
    return;
  }

  const { password: hashedPassword, ...userData } = currentUser.toJSON();

  const checkPassword = await bcryptjs.compare(password, hashedPassword);

  if (!checkPassword) {
    res.status(401).send('invalid password');
    return;
  }

  //@ts-ignore
  req.session.user = userData;

  res.send(userData);
});

router.post('/signup', async (req: Request, res: Response) => {
  const { body: { email, password } } = req;

  const genSalt = await bcryptjs.genSalt(10);

  const hashedPassword = await bcryptjs.hash(password, genSalt);

  const user = await User.create({ email, password: hashedPassword });

  const { password: _, ...userData } = user.toJSON();

  res.send(userData);
});

router.get('/logout', async (req: Request, res: Response) => {
  req.session.destroy(() => console.log('logout success'));

  res.send('logout');
});

export default router;