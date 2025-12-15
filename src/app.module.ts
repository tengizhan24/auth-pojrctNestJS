import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { User } from './users/user.entity';
import { Brand } from './cars/entities/brand.entity';
import { CarModel } from './cars/entities/car-model.entity';
import { UserCar } from './cars/entities/user-car.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Настройка статических файлов - УБЕДИТЕСЬ ЧТО ЭТО ПРАВИЛЬНЫЙ ПУТЬ
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Это правильный путь из dist
      serveRoot: '/', // Файлы будут доступны по корневому URL
      exclude: ['/api/*'], // Не обрабатывать API запросы
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('DB Configuration:', {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          database: configService.get('DB_DATABASE'),
          username: configService.get('DB_USERNAME'),
        });
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: +configService.get('DB_PORT', 5433),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres123'),
          database: configService.get('DB_DATABASE', 'auth_db'),
          entities: [User, Brand, CarModel, UserCar],
          synchronize: true,
          logging: true,
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
    
    AuthModule,
    UsersModule,
    CarsModule
  ],
})
export class AppModule {}