import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CarModel } from './entities/car-model.entity';
import { UserCar } from './entities/user-car.entity';
import { CreateUserCarDto } from './dto/create-user-car.dto';

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

  async findAllBrands(): Promise<Brand[]> {
    return this.brandRepository.find({ order: { name: 'ASC' } });
  }

  async findModelsByBrand(brandId: string): Promise<CarModel[]> {
    return this.modelRepository.find({
      where: { brandId },
      order: { name: 'ASC' },
    });
  }

  async getUserCars(userId: string): Promise<UserCar[]> {
    return this.userCarRepository.find({
      where: { userId },
      relations: ['brand', 'model'],
      order: { created_at: 'DESC' },
    });
  }

  async addUserCar(userId: string, dto: CreateUserCarDto): Promise<UserCar> {
    // Проверяем существование модели и бренда
    const model = await this.modelRepository.findOne({
      where: { id: dto.modelId, brandId: dto.brandId },
      relations: ['brand'],
    });

    if (!model) {
      throw new NotFoundException('Модель не найдена для выбранной марки');
    }

    // Проверяем, не добавлен ли уже такой автомобиль
    const existing = await this.userCarRepository.findOne({
      where: {
        userId,
        brandId: dto.brandId,
        modelId: dto.modelId,
      },
    });

    if (existing) {
      throw new ConflictException('Этот автомобиль уже есть в вашем списке');
    }

    const userCar = this.userCarRepository.create({
      userId,
      brandId: dto.brandId,
      modelId: dto.modelId,
    });

    return this.userCarRepository.save(userCar);
  }

  async updateUserCar(
    id: string,
    userId: string,
    dto: CreateUserCarDto,
  ): Promise<UserCar> {
    const userCar = await this.userCarRepository.findOne({
      where: { id, userId },
    });

    if (!userCar) {
      throw new NotFoundException('Автомобиль не найден');
    }

    // Проверяем существование модели и бренда
    const model = await this.modelRepository.findOne({
      where: { id: dto.modelId, brandId: dto.brandId },
    });

    if (!model) {
      throw new NotFoundException('Модель не найдена для выбранной марки');
    }

    userCar.brandId = dto.brandId;
    userCar.modelId = dto.modelId;
    userCar.updated_at = new Date();

    return this.userCarRepository.save(userCar);
  }

  async deleteUserCar(id: string, userId: string): Promise<void> {
    const result = await this.userCarRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Автомобиль не найден');
    }
  }

  // Метод для инициализации данных (можно вызвать при старте приложения)
  async seedInitialData() {
    console.log('Seeding initial car data...');

    try {
      // Создаем марки если их нет
      const toyota = await this.createBrandIfNotExists('Toyota');
      const mercedes = await this.createBrandIfNotExists('Mercedes');

      // Создаем модели Toyota
      await this.createModelsForBrand(toyota, [
        'Corolla',
        'Camry',
        'RAV4',
        'Land Cruiser Prado',
        'Hilux',
      ]);

      // Создаем модели Mercedes
      await this.createModelsForBrand(mercedes, [
        'C-Class',
        'E-Class',
        'G-Class',
        'GLC',
        'S-Class',
      ]);

      console.log('Car data seeded successfully!');
    } catch (error) {
      console.error('Error seeding car data:', error);
    }
  }

  private async createBrandIfNotExists(name: string): Promise<Brand> {
    let brand = await this.brandRepository.findOne({ where: { name } });

    if (!brand) {
      brand = this.brandRepository.create({ name });
      brand = await this.brandRepository.save(brand);
    }

    return brand;
  }

  private async createModelsForBrand(
    brand: Brand,
    models: string[],
  ): Promise<void> {
    for (const modelName of models) {
      const existingModel = await this.modelRepository.findOne({
        where: {
          name: modelName,
          brandId: brand.id,
        },
      });

      if (!existingModel) {
        const model = this.modelRepository.create({
          name: modelName,
          brand,
          brandId: brand.id,
        });

        await this.modelRepository.save(model);
      }
    }
  }
}
