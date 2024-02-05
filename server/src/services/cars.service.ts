import { Document, PaginateOptions, PaginateResult } from 'mongoose';
import Car, { CarType, CarDocument } from '../db/car';

export type SortType = keyof Omit<CarType, 'brand'>;

export type SortFlow = 'asc' | 'desc';

type GetListProps = {
  filterOptions: {
    brand?: string;
    name?: string;
    price?: string | object;
    yearOfCreated?: string | object;
  },
  sortOptions: Partial<Record<keyof CarType, 1 | -1>>,
  offset?: number,
  limit?: number;
}

export class CarsService {
  async getList({
    filterOptions,
    sortOptions,
    offset,
    limit,
  }: GetListProps)
  : Promise<PaginateResult<Document<CarDocument, PaginateOptions>>> {
    return Car.paginate(filterOptions, { sort: sortOptions, offset, limit });
  }

  async getCurrentCar(id: string): Promise<CarType | null> {
    return Car.findById(id);
  }

  async createCar(data: CarType): Promise<CarDocument> {
    try {
      return Car.create(data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCar(_id: string, data: Partial<CarType>): Promise<CarDocument | null> {
    try {
      if (Object.values(data).some((elem) => elem == null || elem === 'null' )) {
        throw new Error('dont set null values');
      }
      
      return Car.findOneAndUpdate(
        { _id },
        { ...data },
        { returnDocument: 'after' },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteCar(_id: string): Promise<string> {
    const result = await Car.findByIdAndDelete(_id);

    if (result == null) {
      throw new Error('car not found');
    }

    return 'success';
  }
}