import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  yearOfCreated: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Car = mongoose.model('Car', carSchema);

export default Car;