import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Brand } from './brand.entity';
import { UserCar } from './user-car.entity';

@Entity('car_models')
export class CarModel {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => Brand, brand => brand.models, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_uuid' })
  brand: Brand;

  @Column('uuid')
  brand_uuid: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserCar, userCar => userCar.model) // Исправлено: userCar.carModel → userCar.model
  userCars: UserCar[];

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}