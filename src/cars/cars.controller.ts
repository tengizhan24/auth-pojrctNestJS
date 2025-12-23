import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateUserCarDto, UpdateUserCarDto } from './dto/create-user-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  getUserCars(@Request() req) {
    console.log('=== GET /cars/my-cars ===');
    console.log('req.user:', req.user);
    console.log('req.user.sub:', req.user?.sub);
    console.log('req.user.uuid:', req.user?.uuid);
    
    // Проверяем все возможные варианты где может быть UUID
    const userUuid = req.user?.sub || req.user?.uuid || req.user?.id;
    
    if (!userUuid) {
      console.error('ERROR: Не могу найти user UUID в JWT payload');
      console.error('Полный объект req.user:', JSON.stringify(req.user, null, 2));
      throw new UnauthorizedException('User UUID not found in JWT payload');
    }
    
    console.log('Использую userUuid:', userUuid);
    return this.carsService.getUserCars(userUuid);
  }

  @Post('my-cars')
  createUserCar(@Request() req, @Body() dto: CreateUserCarDto) {
    console.log('=== POST /cars/my-cars ===');
    console.log('req.user:', req.user);
    console.log('Request body:', dto);
    
    const userUuid = req.user?.sub || req.user?.uuid || req.user?.id;
    
    if (!userUuid) {
      console.error('ERROR: Не могу найти user UUID в JWT payload');
      throw new UnauthorizedException('User UUID not found in JWT payload');
    }
    
    console.log('Использую userUuid:', userUuid);
    return this.carsService.createUserCar(userUuid, dto);
  }

  @Put('my-cars/:uuid')
  updateUserCar(
    @Param('uuid') uuid: string,
    @Request() req,
    @Body() dto: UpdateUserCarDto,
  ) {
    const userUuid = req.user?.sub || req.user?.uuid || req.user?.id;
    
    if (!userUuid) {
      throw new UnauthorizedException('User UUID not found');
    }
    
    return this.carsService.updateUserCar(uuid, userUuid, dto);
  }

  @Delete('my-cars/:uuid')
  deleteUserCar(@Param('uuid') uuid: string, @Request() req) {
    const userUuid = req.user?.sub || req.user?.uuid || req.user?.id;
    
    if (!userUuid) {
      throw new UnauthorizedException('User UUID not found');
    }
    
    return this.carsService.deleteUserCar(uuid, userUuid);
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