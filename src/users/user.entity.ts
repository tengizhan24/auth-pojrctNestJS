import { IsUUID } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { UserCar } from '../cars/entities/user-car.entity'; //../../cars/entities/user-car.entity

@Entity('users')
export class User {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  @IsUUID('7', { message: 'Некорректный UUID пользователя' })
  uuid: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserCar, userCar => userCar.user)
  userCars: UserCar[];

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuidv7();
    }
  }
}