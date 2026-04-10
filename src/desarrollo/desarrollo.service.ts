import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateDesarrolloDto } from './dto/create-desarrollo.dto';
import { Desarrollo } from './desarrollo.entity';

@Injectable()
export class DesarrolloService {
  constructor(
    @InjectRepository(Desarrollo)
    private readonly desarrolloRepository: Repository<Desarrollo>,
    private readonly logsService: LogsService,
  ) {}

  async create(createDesarrolloDto: CreateDesarrolloDto, actor: string) {
    const desarrollo = this.desarrolloRepository.create(createDesarrolloDto);
    const saved = await this.desarrolloRepository.save(desarrollo);
    await this.logsService.create(actor, 'CREA_DESARROLLO');
    return saved;
  }

  async createMany(createDesarrolloDtos: CreateDesarrolloDto[], actor: string) {
    const desarrollos = this.desarrolloRepository.create(createDesarrolloDtos);
    const saved = await this.desarrolloRepository.save(desarrollos);
    await this.logsService.create(actor, `CREA_DESARROLLO_BULK:${saved.length}`);
    return saved;
  }

  findAll() {
    return this.desarrolloRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
