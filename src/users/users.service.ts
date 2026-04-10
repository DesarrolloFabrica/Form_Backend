import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'contrasenaHash'>> {
    const existingUser = await this.userRepository.findOne({
      where: { correo: createUserDto.correo },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }

    const hash = await bcrypt.hash(createUserDto.contrasena, 10);
    const user = this.userRepository.create({
      nombre: createUserDto.nombre,
      correo: createUserDto.correo,
      contrasenaHash: hash,
      rol: createUserDto.rol,
    });
    const saved = await this.userRepository.save(user);

    return this.sanitize(saved);
  }

  findByCorreo(correo: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { correo } });
  }

  sanitize(user: User): Omit<User, 'contrasenaHash'> {
    const { contrasenaHash: _contrasenaHash, ...safeUser } = user;
    return safeUser;
  }
}
