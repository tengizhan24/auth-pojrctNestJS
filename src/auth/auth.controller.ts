// импорт библиотек
import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController { // Отвечает за прием HTTP Запросов от клиента 
  //Этот класс будет обрабвтовать все запросы,которые начинаются с пути /auth 
  constructor(private authService: AuthService) {}

  @Post('register') // определяет маршрут, который слушает Post запросы по адресу auth/register
  // @Body() registerDto извлекает данные из тела запроса (Json) еотрый отправил клиент 
  async register(@Body() registerDto: { username: string; password: string }) { // Мы жаем имя registerDto
    return this.authService.register(registerDto.username, registerDto.password); // Делегирует всю сложную работу хеширование, запись в БД, проверка ошибок сервису AuyhService и возвращает результат клиенту 
  }
// Обработка запроса /auth/login 
  @Post('login')
  @HttpCode(HttpStatus.OK)
  //По умолчанию POST-запросы возвращают статус 201 Created. Эта строка явно указывает NestJS 
  //вернуть статус 200 OK, что является общепринятой практикой для маршрутов входа (логина).
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto.username, loginDto.password);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Возвращаем данные пользавателя из JWT payload
    return {
      id: req.user.id, 
      username: req.user.username,
    }; 
  }
}