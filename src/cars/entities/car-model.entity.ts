import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('car_models')
export class CarModel {
  @PrimaryColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column('uuid', { name: 'brand_uuid' })
  brand_uuid: string;

  @ManyToOne('Brand')
  @JoinColumn({ name: 'brand_uuid' })
  brand: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}