import { Request, Response } from "express";
import { CarsService } from "../services/cars.service";
import { getListQuerySchema } from "../validationSchemas/cars.validation";
import { extractErrorMessage } from "../utils";

export class CarsController {
  private carsService: CarsService;

  constructor() {
    this.carsService = new CarsService();
  }

  async getList(req: Request, res: Response) {
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
  
      const cars = await this.carsService.getList({
        filterOptions,
        sortOptions,
        limit: Number(limit),
        offset: Number(offset),
      });
    
      res.status(200)
      res.send(cars);
    } catch (error) {
      res.status(400);
      res.send(error);
    }
  }

  async createCar(req: Request, res: Response) {
    try {
      const car = await this.carsService.createCar({ ...req.body });

      res.status(201);
      res.send(car);
    } catch (error: unknown) {
      res.status(400);
      const message = extractErrorMessage(error);
      if (message === 'Try again later') {
        return res.send(error);
      } else {
        return res.send(message);
      }
    }
  }

  async updateCar(req: Request, res: Response) {
    try {
      const { params: { id }, body } = req;
  
      const updatedCar = await this.carsService.updateCar(id, body);
    
      if (!updatedCar) {
        res.status(404);
        res.send('Car with this id not found');
        return;
      } else {
        res.status(200);
        res.send(updatedCar);
      }
    } catch (error) {
      res.status(400);
      const message = extractErrorMessage(error);
      if (message === 'Try again later') {
        return res.send(error);
      } else {
        return res.send(message);
      }
    }
  }

  async deleteCar(req: Request, res: Response) {
    try {
      const { params: { id } } = req;
  
      await this.carsService.deleteCar(id);
  
      res.status(200);
      res.send('success');
    } catch (error) {
      res.status(400);
      const message = extractErrorMessage(error);
      if (message === 'Try again later') {
        return res.send(error);
      } else if (message === 'car not found') {
        res.status(404);
        res.send(message);
      } else {
        return res.send(message);
      }
    }
  }
}