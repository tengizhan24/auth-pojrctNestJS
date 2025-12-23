import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateUserCarDto {
  @IsUUID('7', { message: 'Некорректный UUID марки автомобиля' })
  brand_uuid: string;

  @IsUUID('7', { message: 'Некорректный UUID модели автомобиля' })
  model_uuid: string;

  @IsOptional()
  @IsString({ message: 'Причина должна быть строкой' })
  reason?: string;
}

export class UpdateUserCarDto {
  @IsOptional()
  @IsUUID('7', { message: 'Некорректный UUID марки автомобиля' })
  brand_uuid?: string;

  @IsOptional()
  @IsUUID('7', { message: 'Некорректный UUID модели автомобиля' })
  model_uuid?: string;

  @IsOptional()
  @IsString({ message: 'Причина должна быть строкой' })
  reason?: string; // <-- ДОБАВЬТЕ ЭТО
}