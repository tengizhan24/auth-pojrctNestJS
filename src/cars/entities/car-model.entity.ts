import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { v7 as uuidv7 } from 'uuid';

@Entity('car_models')
export class CarModel {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Column()
  name: string;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'brand_id' })
  brandId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
