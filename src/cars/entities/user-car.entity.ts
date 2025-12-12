import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Brand } from './brand.entity';
import { CarModel } from './car-model.entity';

@Entity('user_cars')
export class UserCar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id' })
  brandId: number;

  @ManyToOne(() => CarModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_id' })
  model: CarModel;

  @Column({ name: 'model_id' })
  modelId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}