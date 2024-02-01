import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: String,
  name: String,
  yearOfCreated: Number,
  price: Number,
});

//TODO: update schema add required to fields

const Car = mongoose.model('Car', carSchema);

export default Car;