import httpMocks from 'node-mocks-http';

import { CarsController } from "../controllers/cars.controller";
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
};

export const MOCK_CAR_ID = '65bc0812c4f38450c97838cb';

describe('CarsController', () => {
  let carsController = new CarsController();

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
    expect(carsController).toBeDefined();
  });

  describe('create car endpoint', () => {
    const request = httpMocks.createRequest({
      body: testCarData,
    });

    const badRequest = httpMocks.createRequest({
      body: brokenTestData,
    });

    const response = httpMocks.createResponse();

    it('send 201 status if car is correctly create', async () => {
      await carsController.createCar(request, response);

      expect(response.statusCode).toBe(201);
    });

    it('send 400 status if car controller throw error', async () => {
      await carsController.createCar(badRequest, response);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('update car endpoint', () => {
    const response = httpMocks.createResponse();

    it('send 200 status, if car is correctly update', async () => {
      const createdCar = await Car.create(testCarData);
  
      const request = httpMocks.createRequest({
        params: { id: createdCar.id },
        body: { price: 12000000 },
      });
  
      await carsController.updateCar(request, response);

      expect(response.statusCode).toBe(200);
    });

    it('send 404 status if car not found', async () => {
      const request = httpMocks.createRequest({
        params: { id: MOCK_CAR_ID },
        body: { price: 12000000 },
      });

      await carsController.updateCar(request, response);

      expect(response.statusCode).toBe(404);
    });

    it('send 400 status if try to set null value', async () => {
      const request = httpMocks.createRequest({
        params: { id: MOCK_CAR_ID },
        body: { name: null },
      });

      await carsController.updateCar(request, response);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('delete car endpoint', () => {
    const response = httpMocks.createResponse();

    it('send 200 status, if car is correctly delete', async () => {
      const createdCar = await Car.create(testCarData);
  
      const request = httpMocks.createRequest({
        params: { id: createdCar.id },
      });
  
      await carsController.deleteCar(request, response);

      expect(response.statusCode).toBe(200);
    });

    it('send 404 status if car not found', async () => {
      const request = httpMocks.createRequest({
        params: { id: MOCK_CAR_ID },
      });

      await carsController.deleteCar(request, response);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('get list endpoint', () => {
    const response = httpMocks.createResponse();

    it('send status 200', async () => {
      const request = httpMocks.createRequest({
        query: {
          brand: 'BMW',
          limit: '10',
          offset: '0',
        },
      });

      await carsController.getList(request, response);

      expect(response.statusCode).toBe(200);
    });

    it('send status 400 if invalid quuery params', async () => {
      const request = httpMocks.createRequest({
        query: {
          brand: 'BMW',
          limit: '10',
          offset: '0',
          sort: 'invalid param'
        },
      });

      await carsController.getList(request, response);

      expect(response.statusCode).toBe(400);
    });
  });
})