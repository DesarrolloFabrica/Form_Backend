import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LogsService } from '../logs/logs.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsService,
  ) {}

  register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByCorreo(loginDto.correo);

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isValidPassword = await bcrypt.compare(loginDto.contrasena, user.contrasenaHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol,
    };

    await this.logsService.create(user.correo, 'LOGIN_EXITOSO');

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.usersService.sanitize(user),
    };
  }
}
