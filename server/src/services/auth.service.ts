import { UserType } from '../db/user';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { UsersService } from './users.service';

type UserAuthProps = {
  email: string;
  password: string;
};

type UserWithoutPassword = Omit<UserType, 'password'>;

type LoginResult = {
  token: string;
  userData: UserWithoutPassword;
}

export class AuthService {
  private bcryptService: BcryptService;
  private usersService: UsersService;
  private jwtService: JwtService;

  constructor() {
    this.bcryptService = new BcryptService();
    this.jwtService = new JwtService();
    this.usersService = new UsersService();
  }

  async login({ email, password }: UserAuthProps): Promise<LoginResult> {
    const currentUser = await this.usersService.findUserByEmail(email);

    if (!currentUser) {
      throw new Error('user not found');
    }

    const { password: dbPassword, ...userData } = currentUser.toJSON<UserType>();

    const checkPassword = await this.bcryptService.compare(password, dbPassword);

    if (!checkPassword) {
      throw new Error('invalid password');
    }

    const token = await this.jwtService.sign(userData);

    return {
      userData: userData,
      token,
    };
  }

  async signup({ email, password }: UserAuthProps): Promise<UserWithoutPassword> {
    const currentUser = await this.usersService.findUserByEmail(email);

    if (currentUser) {
      throw new Error('user already exist');
    }

    const hashedPassword = await this.bcryptService.hash(password);

    const newUser = await this.usersService.createUser({ email, password: hashedPassword });

    const { password: _, ...userData } = newUser.toJSON<UserType>();

    return userData;
  }
}