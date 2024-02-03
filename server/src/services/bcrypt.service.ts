import bcryptjs from 'bcryptjs';

export class BcryptService {
  private salt: number;
  constructor() {
    this.salt = 10;
  }

  async hash(password: string): Promise<string> {
    const genSalt = await bcryptjs.genSalt(this.salt);

    return bcryptjs.hash(password, genSalt);
  }

  async compare(password: string, dbPassword: string): Promise<boolean> {
    return bcryptjs.compare(password, dbPassword);
  }
}