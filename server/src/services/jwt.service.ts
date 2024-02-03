import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

import { UserType } from '../db/user';

dotenv.config({ path: '.env' });

export class JwtService {
  private accessSecret: string;
  private accessTtl: string;
  constructor() {
    this.accessSecret = process.env.JWT_SECRET as string;
    this.accessTtl = process.env.JWT_TTL as string;
  }

  async sign(data: Omit<UserType, 'password'>): Promise<string> {
    return jwt.sign({ user: data }, this.accessSecret, { expiresIn: `${this.accessTtl}m` })
  }

  async verify(token: string): Promise<JwtPayload | string> {
    return jwt.verify(token, this.accessSecret);
  }
}