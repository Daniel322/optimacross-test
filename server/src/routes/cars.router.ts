import express, { Request, Response } from 'express';

import Car from '../db/car';
import sessionChecker from '../middlewares/session.middleware';


const router = express.Router();

router.get('/', sessionChecker, async (req: Request, res: Response) => {
  const cars = await Car.find({});

  res.status(200).send(cars);
});

router.get('/:id', sessionChecker, async (req: Request, res: Response) => {
  const { id } = req.params;

  const currentCar = await Car.findById(id);

  if (!currentCar) {
    res.status(404).send('Current car not found');
  } else {
    res.status(200).send(currentCar);
  }
});

router.post('/', sessionChecker, async (req: Request, res: Response) => {
  console.log(req.body);

  //TODO: add validate method for check fields

  const car = await Car.create({ ...req.body });

  res.status(201).send(car);
});

router.patch('/:id', sessionChecker,  async (req: Request, res: Response) => {
  const { params: { id }, body } = req;

  const updatedCar = await Car.findOneAndUpdate(
    { _id: id },
    { ...body },
    { returnDocument: 'after' },
  );

  if (!updatedCar) {
    res.status(404).send('Car with this id not found');
  } else {
    res.send(updatedCar);
  }
});

router.delete('/:id', sessionChecker, async (req: Request, res: Response) => {
  const { params: { id } } = req;

  await Car.deleteOne({ _id: id });

  res.status(200).send('success');
});

export default router;