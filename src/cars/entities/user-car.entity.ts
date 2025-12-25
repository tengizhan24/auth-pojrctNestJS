import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('user_cars')
export class UserCar {
  @PrimaryColumn('uuid')
  uuid: string;

  @Column('uuid', { name: 'user_uuid' })
  user_uuid: string; 

  @Column('uuid', { name: 'brand_uuid' })
  brand_uuid: string;

  @Column('uuid', { name: 'model_uuid' })
  model_uuid: string;

  @Column('text', { 
    name: 'reason',
    nullable: true,
    default: null 
  })
  reason: string;


  // Тут связи с другими сущностями(relations)
  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
  user: any; // при удалении пользователя удаляются его машины 

  @ManyToOne('Brand', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_uuid' })
  brand: any; 

  @ManyToOne('CarModel', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'model_uuid' })
  model: any;

  // Временные метки 
  @CreateDateColumn({ name: 'selected_at' })
  selectedAt: Date; 

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Авто генерация 
  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}