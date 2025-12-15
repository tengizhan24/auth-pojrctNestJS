import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateUserCarDto, UpdateUserCarDto } from './dto/create-user-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator'; //../auth/get-user.decorator

@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('brands')
  getBrands() {
    return this.carsService.getBrands();
  }

  @Get('brands/:brand_uuid/models')
  getModelsByBrand(@Param('brand_uuid') brand_uuid: string) {
    return this.carsService.getModelsByBrand(brand_uuid);
  }

  @Get('my-cars')
  getUserCars(@GetUser() user) {
    return this.carsService.getUserCars(user.uuid);
  }

  @Post('my-cars')
  createUserCar(@GetUser() user, @Body() dto: CreateUserCarDto) {
    return this.carsService.createUserCar(user.uuid, dto);
  }

  @Put('my-cars/:uuid')
  updateUserCar(
    @Param('uuid') uuid: string,
    @GetUser() user,
    @Body() dto: UpdateUserCarDto,
  ) {
    return this.carsService.updateUserCar(uuid, user.uuid, dto);
  }

  @Delete('my-cars/:uuid')
  deleteUserCar(@Param('uuid') uuid: string, @GetUser() user) {
    return this.carsService.deleteUserCar(uuid, user.uuid);
  }

  @Get('models')
  getAllModels() {
    return this.carsService.getAllModels();
  }

  @Get('search')
  searchModels(@Query('q') query: string) {
    return this.carsService.searchModels(query);
  }
}