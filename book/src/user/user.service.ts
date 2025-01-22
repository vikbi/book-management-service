import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from './entities/users.entity';
import { UsersDTO } from './dto/users.dto';
import { CreateUsersDTO } from './dto/create-user.dto';
import { UpdateUsersDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async showAll(): Promise<UsersDTO[]> {
    return await this.usersRepository.find();
  }

  async register(data: CreateUsersDTO): Promise<UsersDTO> {
    const userData =
        {
          name: data.name,
          password: await bcrypt.hash(data.password, 10),
          email: data.email,
          username: '',
          is_active: false,
          is_admin: false,
          created_at: new Date(),
          updated_at: new Date(),
        };

    this.usersRepository.create(userData);
    const user = await this.usersRepository.save(userData);
    return user;
  }

  async getById(id: number): Promise<UsersDTO> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: number, data: UpdateUsersDTO): Promise<UsersDTO> {
    await this.usersRepository.update({ id }, data);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async destroy(id: number): Promise<unknown> {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }

  async getByUsername(username: string): Promise<UsersDTO> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getByEmail(email: string): Promise<UsersDTO> {
    const user = await this.usersRepository.findOne({ where: { email : email } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
