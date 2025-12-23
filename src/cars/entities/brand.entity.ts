import { IsString, isUUID } from 'class-validator';
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('brands')
export class Brand {
  @PrimaryColumn({ type: 'uuid' })
  id: string = uuidv7();

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
