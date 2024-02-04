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

  async createCar(data: CarType): Promise<CarType> {
    return Car.create(data);
  }

  async updateCar(_id: string, data: Partial<CarType>): Promise<CarType | null> {
    return Car.findOneAndUpdate(
      { _id },
      { ...data },
      { returnDocument: 'after' },
    );
  }

  async deleteCar(_id: string): Promise<string> {
    await Car.deleteOne({ _id });

    return 'success';
  }
}