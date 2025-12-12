import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Пользователь делает запрос 
  @Get()
  getHello(): string {// вызывает метод GetHello
    return this.appService.getHello(); // Метод делегирует выполнения сервису
  }// Возвращает результат
}
