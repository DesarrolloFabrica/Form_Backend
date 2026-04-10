import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activity_logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  fechaIngreso: Date;

  @Column({ name: 'actor', type: 'varchar', length: 160 })
  actor: string;

  @Column({ name: 'event_type', type: 'varchar', length: 160 })
  tipo: string;
}
