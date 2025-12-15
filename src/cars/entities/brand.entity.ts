import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { CarModel } from './car-model.entity';

@Entity('brands')
export class Brand {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  uuid: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => CarModel, model => model.brand)
  models: CarModel[];

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}