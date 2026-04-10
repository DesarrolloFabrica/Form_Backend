import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
