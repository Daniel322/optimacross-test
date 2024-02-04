import express, { Request, Response } from 'express';

import authMiddleware from '../middlewares/auth.middleware';

import { CarsService, SortFlow, SortType } from '../services/cars.service';

import { getListQuerySchema } from '../validationSchemas/cars.validation';
import { extractErrorMessage } from '../utils';


const router = express.Router();

const carsService = new CarsService();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      brand,
      limit,
      offset,
      sort,
      sortType,
    } = req.query;

    getListQuerySchema.parse({
      brand,
      limit,
      offset,
      sort,
      sortType,
    });

    const sortOptions: Record<string, number> = {};

    if (typeof sort === 'string') {
      sortOptions[sort] = sortType === 'asc' ? 1 : -1;
    }

    const filterOptions: Record<string, string | object> = {};

    if (typeof brand === 'string') {
      filterOptions.brand = brand;
    }
  

    const cars = await carsService.getList({
      filterOptions,
      sortOptions,
      limit: Number(limit),
      offset: Number(offset),
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
    res.status(400);
    const message = extractErrorMessage(error);
    if (message === 'Try again later') {
      return res.send(error);
    } else {
      return res.send(message);
    }
  }
});

router.patch('/:id', authMiddleware,  async (req: Request, res: Response) => {
  try {
    const { params: { id }, body } = req;

    const updatedCar = await carsService.updateCar(id, body);
  
    if (!updatedCar) {
      res.status(404).send('Car with this id not found');
    } else {
      res.send(updatedCar);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { params: { id } } = req;

    await carsService.deleteCar(id);

    res.status(200).send('success');
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;