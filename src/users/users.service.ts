import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, password: string): Promise<User> {
    // Проверка на существующего пользователя
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Такой пользователя уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }
}