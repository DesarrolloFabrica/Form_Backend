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

  async create(createDesarrolloDto: CreateDesarrolloDto, actor: string, userId: number) {
    const desarrollo = this.desarrolloRepository.create({
      ...createDesarrolloDto,
      createdByUser: { id: userId },
    });
    const saved = await this.desarrolloRepository.save(desarrollo);
    await this.logsService.create(actor, 'CREA_DESARROLLO', {
      userId,
      targetTable: 'development_requests',
      targetId: saved.id,
      payload: createDesarrolloDto as unknown as Record<string, unknown>,
    });
    return saved;
  }

  async createMany(createDesarrolloDtos: CreateDesarrolloDto[], actor: string, userId: number) {
    const desarrollos = this.desarrolloRepository.create(
      createDesarrolloDtos.map((desarrollo) => ({
        ...desarrollo,
        createdByUser: { id: userId },
      })),
    );
    const saved = await this.desarrolloRepository.save(desarrollos);
    await this.logsService.create(actor, `CREA_DESARROLLO_BULK:${saved.length}`, {
      userId,
      targetTable: 'development_requests',
      payload: {
        count: saved.length,
        ids: saved.map((desarrollo) => desarrollo.id),
      },
    });
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
