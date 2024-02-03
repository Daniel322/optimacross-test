import Car, { CarType } from '../db/car';

export type SortType = keyof Omit<CarType, 'brand'>;

export type SortFlow = 'asc' | 'desc';

type GetListProps = {
  brand: string;
  sort?: SortType;
  sortType?: SortFlow
}

export class CarsService {
  constructor() {}

  async getList({ brand, sort, sortType }: GetListProps): Promise<CarType[]> {
    const sortOptions: Partial<Record<keyof CarType, 1 | -1>> = {};

    if (sort) {
      sortOptions[sort] = 1; //default ASC
    }

    if (sort && sortType && sortType === 'desc') {
      sortOptions[sort] = -1;
    }

    return Car.find({ brand }).sort(sortOptions);
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