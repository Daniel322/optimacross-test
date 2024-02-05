import express, { Request, Response } from 'express';

import authMiddleware from '../middlewares/auth.middleware';
import { CarsController } from '../controllers/cars.controller';

const router = express.Router();

const carsController = new CarsController();

router.get('/', authMiddleware, (req: Request, res: Response) => carsController.getList(req, res));

router.post('/', authMiddleware, (req: Request, res: Response) => carsController.createCar(req, res));

router.patch('/:id', authMiddleware, (req: Request, res: Response) => carsController.updateCar(req, res));

router.delete('/:id', authMiddleware, (req: Request, res: Response) => carsController.deleteCar(req, res));

export default router;