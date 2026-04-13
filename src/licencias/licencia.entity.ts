import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('licenses')
export class Licencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'license_name', type: 'varchar', length: 160 })
  nombreLicencias: string;

  @Column({ name: 'linked_email', type: 'varchar', length: 160 })
  correoVinculado: string;

  @Column({ name: 'purchase_date', type: 'date' })
  fechaCompra: string;

  @Column({ name: 'end_date', type: 'date' })
  fechaFinalizacion: string;

  @Column({ name: 'license_type', type: 'varchar', length: 120 })
  tipoLicencia: string;

  @Column({ name: 'coordination', type: 'varchar', length: 160 })
  coordinacion: string;

  @Column({ name: 'cost', type: 'numeric', precision: 12, scale: 2 })
  costo: string;

  @Column({ name: 'currency', type: 'varchar', length: 12 })
  moneda: string;

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
