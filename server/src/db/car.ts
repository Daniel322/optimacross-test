import mongoose, { Document, PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

export interface CarType {
  brand: string;
  name: string;
  yearOfCreated: number;
  price: number;
};

export interface CarDocument extends Document, CarType {}

const carSchemaStringValidator = (val: string) => val.length >= 2;

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    validate: {
      validator: carSchemaStringValidator,
      message: 'field is shorter than the minimum allowed length 2',
    },
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: carSchemaStringValidator,
      message: 'field is shorter than the minimum allowed length 2',
    },
  },
  yearOfCreated: { type: Number, required: true },
  price: { type: Number, required: true },
  __v: { type: Number, select: false },
});

carSchema.plugin(mongoosePaginate);

const Car = mongoose.model<CarDocument, PaginateModel<CarDocument>>('Car', carSchema);

export default Car;