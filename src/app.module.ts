import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module'; // Добавляем импорт
import { User } from './users/user.entity';
import { Brand } from './cars/entities/brand.entity'; // Добавляем импорт сущностей
import { CarModel } from './cars/entities/car-model.entity';
import { UserCar } from './cars/entities/user-car.entity';


//Декоратор 
@Module({
  imports: [
    // Настройка модуля конфигурации 
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным во всем приложении
      envFilePath: '.env', // Указывает путь к файлу .env
    }),
    
    // Настройка статических файлов
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Папка с HTML файлами
      serveRoot: '/', // Корневой путь для статики
    }),
    
    // Асинхронная настройка TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule
      useFactory: (configService: ConfigService) => {
        console.log('DB Configuration:', {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          database: configService.get('DB_DATABASE'),
          username: configService.get('DB_USERNAME'),
        });
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}', User, Brand, CarModel, UserCar],
          synchronize: true, // Автоматическое создание/обновление таблиц 
          logging: true, // Включение логов SQL запросов
          retryAttempts: 3, // Количество попыток подключения
          retryDelay: 3000, // Задержка между попытками (мс)
        };
      },
      inject: [ConfigService],
    }),
    
    // Импорт модулей приложения
    AuthModule,
    UsersModule,
    CarsModule








  ],
})
export class AppModule {}