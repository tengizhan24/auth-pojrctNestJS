import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';


// Декоратор который говорит Nest, что можно внедрить в другой клас нп(AuthController)
@Injectable()
export class AuthService {
  constructor( // Используется DI для получение двух других сервисов 
    private usersService: UsersService, // Нужен для создания пользователей, поиска их в БД и проверки паролей. 
    private jwtService: JwtService, // Нужен для создания JWT-токенов  
  ) {}


  // Этот метод вызыввается из контроллера (AuthController). 
  async register(username: string, password: string) { // Делегирует задачу создания пользователя(с хешированным пароля и записью в бд)
    const user = await this.usersService.create(username, password);
    return this.generateToken(user); // После успешного создания пользователя он вызывает внутренний метод GenerateToken, чтобы создать для нового пользователя 
  }

  // Метод Login (Вход в систему) Этот метод вызывается, когда пользователь пытаетмя войти. 
  async login(username: string, password: string) {
    const user = await this.usersService.validateUser(username, password); // Вызывает метод в UserService для проверки, существует ли пользователь и совпадвет ли введенный пароль с хешем в БД 
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }


  private generateToken(user: any) {// этот метод используется только внутри AuthService
    const payload = { username: user.username, sub: user.id }; //Определяется полезная нагрузка токена - информация которая мы хотим хранить внутри JWT (логин и ID пользователя )
    return {
      access_token: this.jwtService.sign(payload), //Использует JwtServicce Настроенный в AuthModule с секретным ключем и временемжизни 
      username: user.username, // токен доступа (access_token)
    };
  }
}