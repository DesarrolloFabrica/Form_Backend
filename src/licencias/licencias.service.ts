import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { Licencia } from './licencia.entity';

interface CreatorInfo {
  userId: number;
  email: string;
}

@Injectable()
export class LicenciasService {
  constructor(
    @InjectRepository(Licencia)
    private readonly licenciaRepository: Repository<Licencia>,
    private readonly logsService: LogsService,
  ) {}

  async create(createLicenciaDto: CreateLicenciaDto, creator: CreatorInfo) {
    const licencia = this.licenciaRepository.create({
      ...createLicenciaDto,
      createdByUserId: creator.userId,
      createdByEmail: creator.email,
    });
    const saved = await this.licenciaRepository.save(licencia);
    await this.logsService.create(creator.email, 'CREA_LICENCIA');
    return saved;
  }

  async createMany(createLicenciaDtos: CreateLicenciaDto[], creator: CreatorInfo) {
    const licencias = this.licenciaRepository.create(
      createLicenciaDtos.map((dto) => ({
        ...dto,
        createdByUserId: creator.userId,
        createdByEmail: creator.email,
      })),
    );
    const saved = await this.licenciaRepository.save(licencias);
    await this.logsService.create(creator.email, `CREA_LICENCIA_BULK:${saved.length}`);
    return saved;
  }

  findAll() {
    return this.licenciaRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
