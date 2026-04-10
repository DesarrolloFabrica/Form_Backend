import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('licencias')
export class Licencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_licencias', type: 'varchar', length: 160 })
  nombreLicencias: string;

  @Column({ name: 'correo_vinculado', type: 'varchar', length: 160 })
  correoVinculado: string;

  @Column({ name: 'fecha_compra', type: 'date' })
  fechaCompra: string;

  @Column({ name: 'fecha_finalizacion', type: 'date' })
  fechaFinalizacion: string;

  @Column({ name: 'tipo_licencia', type: 'varchar', length: 120 })
  tipoLicencia: string;

  @Column({ name: 'coordinacion', type: 'varchar', length: 160 })
  coordinacion: string;

  @Column({ name: 'costo', type: 'numeric', precision: 12, scale: 2 })
  costo: string;

  @Column({ name: 'moneda', type: 'varchar', length: 12 })
  moneda: string;
}
