import mongoose from 'mongoose';

import { CarsService } from '../services/cars.service';
import Car from '../db/car';

import dbMock from './db-mock';

const testCarData = {
  brand: 'BMW',
  name: 'M3',
  price: 10000000,
  yearOfCreated: 2022,
};

const brokenTestData = {
  name: '',
  brand: '',
  price: 0,
  yearOfCreated: 0,
}


describe('CarsService', () => {
  let carsService = new CarsService();

beforeAll(async () => {
  await dbMock.connect();
});

afterEach(async () => {
  await dbMock.clearDatabase();
});

afterAll(async () => {
  await dbMock.closeDatabase();
});

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  describe('create car', () => {
    it('send validation error if data is broken', async () => {
      await expect(carsService.createCar(brokenTestData)).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('create car correctly', async () => {
      expect(async () => {
        await carsService.createCar(testCarData)
      }).not.toThrow();
    });

    it('exists after being created', async () => {
      await carsService.createCar(testCarData);

      const createdCar = await Car.findOne();

      expect(createdCar.name).toBe(testCarData.name);
    });
  });

  describe('update car', () => {
    it('correctly update', async () => {
      const createdCar = await carsService.createCar(testCarData);

      const updatedCar = await carsService.updateCar(createdCar._id, { name: 'I6' });
      expect(updatedCar.name).toBe('I6');
    });

    it('send error', async () => {
      const createdCar = await carsService.createCar(testCarData);

      await expect(carsService.updateCar(createdCar._id, { name: null })).rejects.toThrow(Error);
    });
  });

  describe('delete car', () => {
    it('correctly delete', async () => {
      const createdCar = await carsService.createCar(testCarData);

      await carsService.deleteCar(createdCar._id);

      const cars = await Car.find();

      expect(cars.length).toBe(0);
    });

    it('send error if dont find car before delete', async () => {
      await expect(carsService.deleteCar('123')).rejects.toThrow(Error);
    })
  });

  describe('get list', () => {
    it('correctly get list', async () => {
      await carsService.createCar(testCarData);

      const carsList = await carsService.getList({
        filterOptions: { brand: 'BMW' },
        sortOptions: { price: 1 },
        limit: 10,
        offset: 0,
      });

      expect(carsList.docs.length).toBe(1);
    });

    it('can get list with empty sort and filter options', async () => {
      await carsService.createCar(testCarData);

      const carsList = await carsService.getList({
        filterOptions: {},
        sortOptions: {},
        limit: 10,
        offset: 0,
      });

      expect(carsList.docs.length).toBe(1);
    });

    it('return empty list with invalid filter', async () => {
      await carsService.createCar(testCarData);

      const carsList = await carsService.getList({
        filterOptions: { brand: 'Lada' },
        sortOptions: {},
        limit: 10,
        offset: 0,
      });

      expect(carsList.docs.length).toBe(0);
    })
  });
});