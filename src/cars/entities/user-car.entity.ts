import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Brand } from './brand.entity';
import { CarModel } from './car-model.entity';
import { v7 as uuidv7 } from 'uuid';

@Entity('user_cars')
export class UserCar {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id' })
  brandId: string;

  @ManyToOne(() => CarModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_id' })
  model: CarModel;

  @Column({ name: 'model_id' })
  modelId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
