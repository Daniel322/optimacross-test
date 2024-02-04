import { FilterQuery } from 'mongoose';
import Car, { CarType } from '../db/car';

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
}

export class CarsService {
  async getList({ filterOptions, sortOptions }: GetListProps): Promise<CarType[]> {
    return Car.find(filterOptions).sort(sortOptions);
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