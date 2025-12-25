import { Entity, PrimaryColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('brands')
export class Brand {
  @PrimaryColumn('uuid')
  uuid: string;

  @Column({ unique: true }) // Поле должно быть уникальным в таблице
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}