import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';

@Entity('car_models')
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id' })
  brandId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}