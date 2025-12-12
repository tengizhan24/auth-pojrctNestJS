import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('JWT Configuration:', { 
          secret: configService.get('JWT_SECRET') ? '***' : 'NOT SET',
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        });
        
        return {
          secret: configService.get('JWT_SECRET') || 'secretKey',
          signOptions: { 
            expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}