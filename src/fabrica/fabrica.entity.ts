import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('factory_requests')
export class Fabrica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'request_type', type: 'varchar', length: 120 })
  tipoRequisicion: string;

  @Column({ name: 'module_count', type: 'int' })
  cantidadModulos: number;

  @Column({ name: 'granule_count', type: 'int' })
  cantidadGranulos: number;

  @Column({ name: 'materials', type: 'text' })
  materiales: string;

  @Column({ name: 'material_count', type: 'int' })
  cantidadMateriales: number;

  @Column({ name: 'work_order_request_date', type: 'date' })
  fechaSolicitudOt: string;

  @Column({ name: 'requester', type: 'varchar', length: 160 })
  solicitante: string;

  @Column({ name: 'delivery_date', type: 'date' })
  fechaEntrega: string;

  @Column({ name: 'input_delivery', type: 'varchar', length: 160, nullable: true })
  entregaInsumo?: string;

  @Column({ name: 'input_link', type: 'text', nullable: true })
  enlaceInsumo?: string;

  @Column({ name: 'package_type', type: 'varchar', length: 120 })
  tipoPaquete: string;

  @Column({ name: 'request_channel', type: 'varchar', length: 120 })
  canalSolicitud: string;

  @Column({ name: 'status', type: 'varchar', length: 120 })
  estado: string;

  @Column({ name: 'progress_type', type: 'varchar', length: 120 })
  tipoProgreso: string;

  @Column({ name: 'school', type: 'varchar', length: 120 })
  escuela: string;

  @Column({ name: 'program', type: 'varchar', length: 120 })
  programa: string;

  @Column({ name: 'learning_mode', type: 'varchar', length: 120 })
  modalidad: string;

  @Column({ name: 'subject_count', type: 'int' })
  cantidadMaterias: number;

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
