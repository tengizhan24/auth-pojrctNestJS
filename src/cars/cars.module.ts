import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Brand } from './entities/brand.entity';
import { CarModel } from './entities/car-model.entity';
import { UserCar } from './entities/user-car.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, CarModel, UserCar]),
    AuthModule
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule implements OnModuleInit {
  constructor(private readonly carsService: CarsService) {}

  async onModuleInit() {
    // Заполняем базу начальными данными при запуске модуля
    await this.carsService.seedInitialData();
  }
}