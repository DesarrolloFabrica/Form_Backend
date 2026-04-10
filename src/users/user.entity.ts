import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre', type: 'varchar', length: 120 })
  nombre: string;

  @Column({ name: 'correo', type: 'varchar', length: 160, unique: true })
  correo: string;

  @Column({ name: 'contrasena', type: 'varchar', length: 255 })
  contrasenaHash: string;

  @Column({
    name: 'rol',
    type: 'enum',
    enum: UserRole,
  })
  rol: UserRole;
}
