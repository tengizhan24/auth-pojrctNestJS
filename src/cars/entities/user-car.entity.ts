import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from '../../users/user.entity';
import { Brand } from './brand.entity';
import { CarModel } from './car-model.entity';

@Entity('user_cars')
export class UserCar {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  uuid: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Column('uuid', { name: 'user_uuid' })
  user_uuid: string;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_uuid' })
  brand: Brand;

  @Column('uuid', { name: 'brand_uuid' })
  brand_uuid: string;

  @ManyToOne(() => CarModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_uuid' })
  model: CarModel;

  @Column('uuid', { name: 'model_uuid' })
  model_uuid: string;

  @CreateDateColumn({ name: 'selected_at' })
  selectedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}