import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import * as bcrypt from 'bcrypt';

import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const existingEmail = await this.userModel.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new BadRequestException('El email ya está registrado');
    }

    const existingUsername = await this.userModel.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new BadRequestException('El username ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return {
      message: 'Usuario creado correctamente',
      user: this.sanitizeUser(user),
    };
  }

  async findAll() {
    const users = await this.userModel.findAll();

    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.sanitizeUser(user);
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.userModel.findByPk(id);
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar username duplicado
    if (updateUserDto.username) {
      const existingUsername = await this.userModel.findOne({
        where: {
          username: updateUserDto.username,
        },
      });

      if (existingUsername && existingUsername.id !== id) {
        throw new BadRequestException('El username ya existe');
      }
    }

    // Verificar email duplicado
    if (updateUserDto.email) {
      const existingEmail = await this.userModel.findOne({
        where: {
          email: updateUserDto.email,
        },
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException('El email ya está registrado');
      }
    }

    // Hash password si viene
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await user.update(updateUserDto);

    return {
      message: 'Usuario actualizado correctamente',
      user: this.sanitizeUser(user),
    };
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await user.destroy();

    return {
      message: 'Usuario eliminado correctamente',
    };
  }
}
