import mongoose from 'mongoose';

import { CarsService } from '../services/cars.service';

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017';
const dbUserName = process.env.DB_USERNAME || 'mongo';
const dbPassword = process.env.DB_PASSWORD || 'mongo';

describe('CarsService', () => {
  let carsService = new CarsService();

  beforeEach(async () => {
    await mongoose.connect(dbUrl, {
      "auth": {
        "username": dbUserName,
        "password": dbPassword,
      },
    });
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should be defined', () => {
    expect(carsService).toBeDefined();
  });

  describe('get list of cars', () => {
    const filterOptions = {};
    const sortOptions = {};

    it('should get list of cars', async () => {
      const testResult = await carsService.getList({ filterOptions, sortOptions });
      expect(await carsService.getList({ filterOptions, sortOptions })).toEqual(testResult);
    })
  })
})