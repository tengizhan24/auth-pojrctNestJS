import { IsUUID } from 'class-validator';

export class CreateUserCarDto {
  @IsUUID('7', { message: 'Некорректный UUID марки автомобиля' })
  brand_uuid: string;

  @IsUUID('7', { message: 'Некорректный UUID модели автомобиля' })
  model_uuid: string;
}

export class UpdateUserCarDto {
  @IsUUID('7', { message: 'Некорректный UUID марки автомобиля' })
  brand_uuid?: string;

  @IsUUID('7', { message: 'Некорректный UUID модели автомобиля' })
  model_uuid?: string;
}