import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 120 })
  nombre: string;

  @Column({ name: 'email', type: 'varchar', length: 160, unique: true })
  correo: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  contrasenaHash: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
  })
  rol: UserRole;
}
