import { UserRole } from '../users/user-role.enum';

export interface JwtPayload {
  sub: number;
  correo: string;
  nombre: string;
  rol: UserRole;
}
