import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { Licencia } from './licencia.entity';

@Injectable()
export class LicenciasService {
  constructor(
    @InjectRepository(Licencia)
    private readonly licenciaRepository: Repository<Licencia>,
    private readonly logsService: LogsService,
  ) {}

  async create(createLicenciaDto: CreateLicenciaDto, actor: string) {
    const licencia = this.licenciaRepository.create(createLicenciaDto);
    const saved = await this.licenciaRepository.save(licencia);
    await this.logsService.create(actor, 'CREA_LICENCIA');
    return saved;
  }

  async createMany(createLicenciaDtos: CreateLicenciaDto[], actor: string) {
    const licencias = this.licenciaRepository.create(createLicenciaDtos);
    const saved = await this.licenciaRepository.save(licencias);
    await this.logsService.create(actor, `CREA_LICENCIA_BULK:${saved.length}`);
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
