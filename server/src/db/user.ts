import mongoose, { Document } from "mongoose";

import { EMAIL_REGEX } from "../constants";
export interface UserType extends Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (val: string) => EMAIL_REGEX.test(val),
      message: 'invalid email',
    }
  },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;