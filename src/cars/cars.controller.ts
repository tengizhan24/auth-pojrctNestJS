import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  ParseIntPipe 
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateUserCarDto } from './dto/create-user-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cars')// Декоратор Controller делает класс контроллером и задает базовый путь/cars 
export class CarsController {  
  constructor(private readonly carsService: CarsService) {} // Конструктор с Dependency Injection - NestJS автоматически внедряет экземпляр CarsService

  @Get('brands') // Создает Get endpoint по пути 
  async getBrands() {
    return this.carsService.findAllBrands(); // Возвращает результат из сервиса findAllBrands()
  }

  @Get('brands/:brandId/models') // Get enpoint с параметром пути 
  async getModels(@Param('brandId', ParseIntPipe) brandId: number) { // Извлекает параметр brand из URL преоброзует его число 
    return this.carsService.findModelsByBrand(brandId); // Возврощяет пеhtlftn brandId в сервис для получение моделей 
  }

  // Получение автомобиля пользователя(защищенный)
  @UseGuards(JwtAuthGuard) //Защищаем маршрут JWT аутентификацией
  @Get('my') // Get получет enpoint /cars/my 
  async getMyCars(@Request() req) { // получаем обьект запроса 
    return this.carsService.getUserCars(req.user.sub); //извлекаем ID пользователя из JWT токена (sub = subject)
  }

  @UseGuards(JwtAuthGuard) // Защищаем маршрут POST endpoint 
  @Post('my') // POST /cars/my
  async addCar(@Request() req, @Body() dto: CreateUserCarDto) { // Извлекает тело запроса и валидирует его по DTO 
    return this.carsService.addUserCar(req.user.sub, dto); // Передает ID пользователя и данные автомобиля в сервис 
  }

  @UseGuards(JwtAuthGuard)// Защищаем маршрут 
  @Put('my/:id') // PUT /cars/my/123
  async updateCar(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateUserCarDto
  ) {
    return this.carsService.updateUserCar(id, req.user.sub, dto); // Используем sub вместо id
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my/:id')
  async deleteCar(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.carsService.deleteUserCar(id, req.user.sub); // Используем sub вместо id
  }
}