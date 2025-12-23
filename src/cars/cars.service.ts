import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CarModel } from './entities/car-model.entity';
import { UserCar } from './entities/user-car.entity';
import { CreateUserCarDto } from './dto/create-user-car.dto';
import { UpdateUserCarDto } from './dto/create-user-car.dto';

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
    const models = await this.modelRepository.find({
      where: { brand_uuid },
      order: { name: 'ASC' },
    });
    console.log(`Found ${models.length} models for brand ${brand_uuid}`);
    return models;
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
    console.log(`Getting cars for user: ${user_uuid}`);
    
    try {
      const cars = await this.userCarRepository.find({
        where: { user_uuid },
        relations: ['brand', 'model'],
        order: { selectedAt: 'DESC' },
      });
      
      console.log(`Found ${cars.length} cars`);
      cars.forEach((car, i) => {
        console.log(`Car ${i}:`, {
          uuid: car.uuid,
          brand_uuid: car.brand_uuid,
          model_uuid: car.model_uuid,
          reason: car.reason, // Добавили reason
          brand: car.brand ? car.brand.name : 'NO BRAND',
          model: car.model ? car.model.name : 'NO MODEL'
        });
      });
      
      return cars;
    } catch (error) {
      console.error('Error in getUserCars:', error.message);
      throw error;
    }
  }

  // Создание автомобиля пользователя
  async createUserCar(user_uuid: string, dto: CreateUserCarDto) {
    console.log('Creating user car with:', { user_uuid, dto });
    
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
      reason: dto.reason, // Добавляем причину
    });

    const saved = await this.userCarRepository.save(userCar);
    console.log('Created user car:', saved);
    return saved;
  }

  // Обновление автомобиля пользователя - ИСПРАВЛЕННАЯ ВЕРСИЯ
  async updateUserCar(uuid: string, user_uuid: string, dto: UpdateUserCarDto) {
    console.log('=== updateUserCar called ===');
    console.log('uuid:', uuid);
    console.log('user_uuid:', user_uuid);
    console.log('dto:', dto);
    
    // Находим автомобиль для обновления
    const userCar = await this.userCarRepository.findOne({
      where: { uuid, user_uuid },
    });

    if (!userCar) {
      throw new NotFoundException('Автомобиль не найден');
    }

    console.log('Found car:', {
      brand_uuid: userCar.brand_uuid,
      model_uuid: userCar.model_uuid,
      reason: userCar.reason
    });

    // Если меняем модель, проверяем новую модель
    if (dto.model_uuid) {
      // Определяем brand_uuid для проверки
      const brandUuid = dto.brand_uuid || userCar.brand_uuid;
      
      console.log('Checking model with:', {
        model_uuid: dto.model_uuid,
        brand_uuid: brandUuid
      });
      
      const model = await this.modelRepository.findOne({
        where: { 
          uuid: dto.model_uuid,
          brand_uuid: brandUuid,
        },
      });

      if (!model) {
        throw new NotFoundException('Модель не найдена или не принадлежит указанной марке');
      }

      // ПРОВЕРКА ДУБЛИКАТОВ - ИСПРАВЛЕННЫЙ КОД
      const existingUserCar = await this.userCarRepository.findOne({
        where: { 
          user_uuid,
          model_uuid: dto.model_uuid,
          uuid: Not(uuid),
        },
      });

      console.log('Duplicate check result:', existingUserCar ? 'Found duplicate' : 'No duplicate');

      if (existingUserCar) {
        throw new ConflictException('Эта модель уже добавлена в ваш гараж');
      }
    }

    // Обновляем поля
    if (dto.brand_uuid) userCar.brand_uuid = dto.brand_uuid;
    if (dto.model_uuid) userCar.model_uuid = dto.model_uuid;
    
    // Обновляем причину (если передана)
    if (dto.reason !== undefined) {
      console.log('Updating reason to:', dto.reason);
      userCar.reason = dto.reason;
    } else {
      console.log('No reason provided in DTO, keeping existing:', userCar.reason);
    }
    
    userCar.updatedAt = new Date();

    console.log('Saving car with:', {
      brand_uuid: userCar.brand_uuid,
      model_uuid: userCar.model_uuid,
      reason: userCar.reason,
      updatedAt: userCar.updatedAt
    });

    const saved = await this.userCarRepository.save(userCar);
    console.log('Saved result:', saved);
    
    return saved;
  }

  // Удаление автомобиля пользователя
  async deleteUserCar(uuid: string, user_uuid: string) {
    const result = await this.userCarRepository.delete({ 
      uuid, 
      user_uuid,
    });
    
    if (result.affected === 0) {
      throw new NotFoundException('Автомобиль не найден');
    }
    
    return { message: 'Автомобиль удален' };
  }

  // Получение всех моделей
  async getAllModels() {
    console.log('Getting all models...');
    const models = await this.modelRepository.find({
      relations: ['brand'],
      order: { name: 'ASC' },
    });
    console.log(`Found ${models.length} models`);
    return models;
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

  async seedInitialData() {
    try {
      console.log('Seeding initial data...');
      
      const brandsCount = await this.brandRepository.count();
      
      if (brandsCount === 0) {
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

      const modelsCount = await this.modelRepository.count();
      
      if (modelsCount === 0) {
        const brands = await this.brandRepository.find();
        console.log(`Found ${brands.length} brands for seeding models`);
        
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
            console.log(`Seeding models for ${brand.name} (${brand.uuid})`);
            for (const modelName of models) {
              await this.createModel(brand.uuid, modelName);
            }
          } else {
            console.log(`No models defined for brand: ${brand.name}`);
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