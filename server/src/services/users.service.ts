import User, { UserType } from "../db/user";

export class UsersService {
  async findUserByEmail(email: string): Promise<UserType | null> {
    return User.findOne({ email });
  }

  async createUser(data: Pick<UserType, 'email' | 'password'>): Promise<UserType> {
    return User.create(data);
  }
}