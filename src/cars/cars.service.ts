import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CarModel } from './entities/car-model.entity';
import { UserCar } from './entities/user-car.entity';
import { CreateUserCarDto } from './dto/create-user-car.dto';
import { UpdateUserCarDto } from './dto/create-user-car.dto'; //./dto/update-user-car.dto

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(CarModel)
    private modelRepository: Repository<CarModel>,
    @InjectRepository(UserCar)
    private userCarRepository: Repository<UserCar>,
  ) {}

  // Получение всех марок
  async getBrands() {
    return this.brandRepository.find({
      order: { name: 'ASC' },
    });
  }

  // Создание марки
  async createBrand(name: string) {
    const existingBrand = await this.brandRepository.findOne({
      where: { name },
    });
    
    if (existingBrand) {
      throw new ConflictException('Марка с таким названием уже существует');
    }
    
    const brand = this.brandRepository.create({ name });
    return this.brandRepository.save(brand);
  }

  // Получение моделей по марке
  async getModelsByBrand(brand_uuid: string) {
    return this.modelRepository.find({
      where: { brand_uuid },
      order: { name: 'ASC' },
    });
  }

  // Создание модели
  async createModel(brand_uuid: string, name: string) {
    const brand = await this.brandRepository.findOne({
      where: { uuid: brand_uuid },
    });
    
    if (!brand) {
      throw new NotFoundException('Марка не найдена');
    }
    
    const existingModel = await this.modelRepository.findOne({
      where: { brand_uuid, name },
    });
    
    if (existingModel) {
      throw new ConflictException('Модель с таким названием уже существует у этой марки');
    }
    
    const model = this.modelRepository.create({
      name,
      brand_uuid,
    });
    
    return this.modelRepository.save(model);
  }

  // Получение автомобилей пользователя
  async getUserCars(user_uuid: string) {
    return this.userCarRepository.find({
      where: { user_uuid },
      relations: ['brand', 'model'],
      order: { selectedAt: 'DESC' },
    });
  }

  // Создание автомобиля пользователя
  async createUserCar(user_uuid: string, dto: CreateUserCarDto) {
    // Проверяем существование модели
    const model = await this.modelRepository.findOne({
      where: { 
        uuid: dto.model_uuid,
        brand_uuid: dto.brand_uuid,
      },
    });

    if (!model) {
      throw new NotFoundException('Модель не найдена или не принадлежит указанной марке');
    }

    // Проверяем, не добавлена ли уже эта модель пользователем
    const existingUserCar = await this.userCarRepository.findOne({
      where: { 
        user_uuid,
        model_uuid: dto.model_uuid,
      },
    });

    if (existingUserCar) {
      throw new ConflictException('Эта модель уже добавлена в ваш гараж');
    }

    // Создаем запись
    const userCar = this.userCarRepository.create({
      user_uuid,
      brand_uuid: dto.brand_uuid,
      model_uuid: dto.model_uuid,
    });

    return this.userCarRepository.save(userCar);
  }

  // Обновление автомобиля пользователя
  async updateUserCar(uuid: string, user_uuid: string, dto: UpdateUserCarDto) {
    const userCar = await this.userCarRepository.findOne({
      where: { uuid, user_uuid },
    });

    if (!userCar) {
      throw new NotFoundException('Автомобиль не найден');
    }

    // Если меняем модель, проверяем новую модель
    if (dto.model_uuid) {
      const model = await this.modelRepository.findOne({
        where: { 
          uuid: dto.model_uuid,
          brand_uuid: dto.brand_uuid || userCar.brand_uuid,
        },
      });

      if (!model) {
        throw new NotFoundException('Модель не найдена');
      }

      // Проверяем, не добавлена ли уже эта модель пользователем
      const existingUserCar = await this.userCarRepository.findOne({
        where: { 
          user_uuid,
          model_uuid: dto.model_uuid,
          uuid: { $not: uuid } as any, // исключаем текущую запись
        },
      });

      if (existingUserCar) {
        throw new ConflictException('Эта модель уже добавлена в ваш гараж');
      }
    }

    // Обновляем поля
    if (dto.brand_uuid) userCar.brand_uuid = dto.brand_uuid;
    if (dto.model_uuid) userCar.model_uuid = dto.model_uuid;
    userCar.updatedAt = new Date();

    return this.userCarRepository.save(userCar);
  }

  // Удаление автомобиля пользователя
  async deleteUserCar(uuid: string, user_uuid: string) {
    const result = await this.userCarRepository.delete({ uuid, user_uuid });
    
    if (result.affected === 0) {
      throw new NotFoundException('Автомобиль не найден');
    }
    
    return { message: 'Автомобиль удален' };
  }

  // Получение всех моделей
  async getAllModels() {
    return this.modelRepository.find({
      relations: ['brand'],
      order: { name: 'ASC' },
    });
  }

  // Поиск моделей по названию
  async searchModels(query: string) {
    return this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.brand', 'brand')
      .where('model.name ILIKE :query', { query: `%${query}%` })
      .orWhere('brand.name ILIKE :query', { query: `%${query}%` })
      .orderBy('brand.name', 'ASC')
      .addOrderBy('model.name', 'ASC')
      .getMany();
  }

  // Добавьте в конец класса CarsService
async seedInitialData() {
  try {
    console.log('Seeding initial data...');
    
    // Проверяем, есть ли уже данные в таблице марок
    const brandsCount = await this.brandRepository.count();
    
    if (brandsCount === 0) {
      // Создаем начальные марки
      const initialBrands = [
        { name: 'Toyota' },
        { name: 'BMW' },
        { name: 'Mercedes-Benz' },
        { name: 'Audi' },
        { name: 'Ford' },
        { name: 'Honda' },
        { name: 'Volkswagen' },
        { name: 'Hyundai' },
      ];

      for (const brandData of initialBrands) {
        await this.createBrand(brandData.name);
      }
      console.log('Initial brands created');
    }

    // Проверяем, есть ли модели
    const modelsCount = await this.modelRepository.count();
    
    if (modelsCount === 0) {
      // Получаем созданные марки
      const brands = await this.brandRepository.find();
      
      const brandModels = {
        'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Prius'],
        'BMW': ['3 Series', '5 Series', '7 Series', 'X5', 'X3'],
        'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC'],
        'Audi': ['A4', 'A6', 'Q5', 'Q7', 'TT'],
        'Ford': ['Focus', 'Fiesta', 'Mustang', 'Explorer', 'F-150'],
        'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
        'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg'],
        'Hyundai': ['Sonata', 'Elantra', 'Tucson', 'Santa Fe'],
      };

      for (const brand of brands) {
        const models = brandModels[brand.name];
        if (models) {
          for (const modelName of models) {
            await this.createModel(brand.uuid, modelName);
          }
        }
      }
      console.log('Initial models created');
    }

    console.log('Initial data seeding completed');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}



}