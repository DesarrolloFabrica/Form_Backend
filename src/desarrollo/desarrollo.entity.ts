import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('desarrollo')
export class Desarrollo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_proyecto', type: 'varchar', length: 180 })
  nombreProyecto: string;

  @Column({ name: 'fecha_solicitud', type: 'date' })
  fechaSolicitud: string;

  @Column({ name: 'fecha_entrega', type: 'date' })
  fechaEntrega: string;

  @Column({ name: 'solicitante', type: 'varchar', length: 160 })
  solicitante: string;

  @Column({ name: 'estado', type: 'varchar', length: 120 })
  estado: string;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones?: string;
}
