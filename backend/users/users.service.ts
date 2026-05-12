import { Injectable } from '@nestjs/common';
import { User } from '../models/users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({ username, email, password: hashedPassword });
  }

  async findByUsername(username: string) {
    return User.findOne({ where: { username } });
  }
}
