import express, { Request, Response } from 'express';

import authMiddleware from '../middlewares/auth.middleware';

import { CarsService, SortFlow, SortType } from '../services/cars.service';

import { getListQuerySchema } from '../validationSchemas/cars.validation';


const router = express.Router();

const carsService = new CarsService();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { brand, sort, sortType } = req.query;

    getListQuerySchema.parse({ brand, sort, sortType });
  
    const cars = await carsService.getList({
      brand: brand as string,
      sort: sort as SortType,
      sortType: sortType as SortFlow ?? 'asc',
    });
  
    res.status(200).send(cars);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  const currentCar = await carsService.getCurrentCar(id);

  if (!currentCar) {
    res.status(404).send('Current car not found');
  } else {
    res.status(200).send(currentCar);
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const car = await carsService.createCar({ ...req.body });

    res.status(201).send(car);
  } catch (error: unknown) {
    res.status(400).send((error as Error)?.message ?? error);
  }
});

router.patch('/:id', authMiddleware,  async (req: Request, res: Response) => {
  const { params: { id }, body } = req;

  const updatedCar = await carsService.updateCar(id, body);

  if (!updatedCar) {
    res.status(404).send('Car with this id not found');
  } else {
    res.send(updatedCar);
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { params: { id } } = req;

  await carsService.deleteCar(id);

  res.status(200).send('success');
});

export default router;