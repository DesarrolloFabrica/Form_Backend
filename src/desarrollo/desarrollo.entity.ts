import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('development_requests')
export class Desarrollo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_name', type: 'varchar', length: 180 })
  nombreProyecto: string;

  @Column({ name: 'request_date', type: 'date' })
  fechaSolicitud: string;

  @Column({ name: 'delivery_date', type: 'date' })
  fechaEntrega: string;

  @Column({ name: 'requester', type: 'varchar', length: 160 })
  solicitante: string;

  @Column({ name: 'status', type: 'varchar', length: 120 })
  estado: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  observaciones?: string;

  @Column({ name: 'created_by_user_id', type: 'int', nullable: true })
  createdByUserId?: number;

<<<<<<< HEAD
  @Column({ name: 'created_by_email', type: 'varchar', length: 160, nullable: true })
  createdByEmail?: string;
=======
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser?: User;
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
}
