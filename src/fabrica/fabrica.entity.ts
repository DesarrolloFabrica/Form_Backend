import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('fabrica')
export class Fabrica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_requisicion', type: 'varchar', length: 120 })
  tipoRequisicion: string;

  @Column({ name: 'cantidad_modulos', type: 'int' })
  cantidadModulos: number;

  @Column({ name: 'cantidad_granulos', type: 'int' })
  cantidadGranulos: number;

  @Column({ name: 'materiales', type: 'text' })
  materiales: string;

  @Column({ name: 'cantidad_materiales', type: 'int' })
  cantidadMateriales: number;

  @Column({ name: 'fecha_solicitud_ot', type: 'date' })
  fechaSolicitudOt: string;

  @Column({ name: 'solicitante', type: 'varchar', length: 160 })
  solicitante: string;

  @Column({ name: 'fecha_entrega', type: 'date' })
  fechaEntrega: string;

  @Column({ name: 'entrega_insumo', type: 'varchar', length: 160, nullable: true })
  entregaInsumo?: string;

  @Column({ name: 'enlace_insumo', type: 'text', nullable: true })
  enlaceInsumo?: string;

  @Column({ name: 'tipo_paquete', type: 'varchar', length: 120 })
  tipoPaquete: string;

  @Column({ name: 'canal_solicitud', type: 'varchar', length: 120 })
  canalSolicitud: string;

  @Column({ name: 'estado', type: 'varchar', length: 120 })
  estado: string;

  @Column({ name: 'tipo_progreso', type: 'varchar', length: 120 })
  tipoProgreso: string;

  @Column({ name: 'escuela', type: 'varchar', length: 120 })
  escuela: string;

  @Column({ name: 'programa', type: 'varchar', length: 120 })
  programa: string;

  @Column({ name: 'modalidad', type: 'varchar', length: 120 })
  modalidad: string;

  @Column({ name: 'cantidad_materias', type: 'int' })
  cantidadMaterias: number;
}
