// update-user-car.dto.ts (если это отдельный файл)
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateUserCarDto {
  @IsUUID()
  brand_uuid: string;

  @IsUUID()
  model_uuid: string;

  @IsOptional()
  @IsString()
  reason?: string; 
}