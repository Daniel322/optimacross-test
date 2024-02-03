import mongoose, { Document } from "mongoose";

export interface CarType extends Document {
  brand: string;
  name: string;
  yearOfCreated: number;
  price: number;
};

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
});

const Car = mongoose.model('Car', carSchema);

export default Car;