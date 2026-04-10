import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fecha_ingreso', type: 'timestamp' })
  fechaIngreso: Date;

  @Column({ name: 'actor', type: 'varchar', length: 160 })
  actor: string;

  @Column({ name: 'tipo', type: 'varchar', length: 160 })
  tipo: string;
}
