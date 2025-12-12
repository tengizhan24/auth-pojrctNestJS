import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserCarDto {
  @IsInt()
  @IsNotEmpty()
  brandId: number;

  @IsInt()
  @IsNotEmpty()
  modelId: number;
} 