import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserCarDto {
  @IsNotEmpty()
  brandId: string;

  @IsNotEmpty()
  modelId: string;
}
