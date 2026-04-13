import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

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

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId?: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'target_table', type: 'varchar', length: 80, nullable: true })
  targetTable?: string;

  @Column({ name: 'target_id', type: 'int', nullable: true })
  targetId?: number;

  @Column({ name: 'payload', type: 'jsonb', nullable: true })
  payload?: Record<string, unknown>;
}
