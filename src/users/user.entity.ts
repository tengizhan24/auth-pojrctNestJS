// src/users/user.entity.ts
import { IsUUID } from 'class-validator';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
