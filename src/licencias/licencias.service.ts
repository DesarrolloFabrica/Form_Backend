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

<<<<<<< HEAD
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
=======
  async create(createLicenciaDto: CreateLicenciaDto, actor: string, userId: number) {
    const licencia = this.licenciaRepository.create({
      ...createLicenciaDto,
      createdByUserId: userId,
    });
    const saved = await this.licenciaRepository.save(licencia);
    await this.logsService.create(actor, 'CREA_LICENCIA', {
      userId,
      targetTable: 'licenses',
      targetId: saved.id,
      payload: createLicenciaDto as unknown as Record<string, unknown>,
    });
    return saved;
  }

  async createMany(createLicenciaDtos: CreateLicenciaDto[], actor: string, userId: number) {
    const licencias = this.licenciaRepository.create(
      createLicenciaDtos.map((licencia) => ({
        ...licencia,
        createdByUserId: userId,
      })),
    );
    const saved = await this.licenciaRepository.save(licencias);
    await this.logsService.create(actor, `CREA_LICENCIA_BULK:${saved.length}`, {
      userId,
      targetTable: 'licenses',
      payload: {
        count: saved.length,
        ids: saved.map((licencia) => licencia.id),
      },
    });
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
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
