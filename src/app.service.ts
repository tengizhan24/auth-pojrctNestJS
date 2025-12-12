import { Injectable } from '@nestjs/common';

@Injectable()// Декоратор 
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
