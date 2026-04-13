import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateDesarrolloDto } from './dto/create-desarrollo.dto';
import { Desarrollo } from './desarrollo.entity';

interface CreatorInfo {
  userId: number;
  email: string;
}

@Injectable()
export class DesarrolloService {
  constructor(
    @InjectRepository(Desarrollo)
    private readonly desarrolloRepository: Repository<Desarrollo>,
    private readonly logsService: LogsService,
  ) {}

<<<<<<< HEAD
  async create(createDesarrolloDto: CreateDesarrolloDto, creator: CreatorInfo) {
    const desarrollo = this.desarrolloRepository.create({
      ...createDesarrolloDto,
      createdByUserId: creator.userId,
      createdByEmail: creator.email,
    });
    const saved = await this.desarrolloRepository.save(desarrollo);
    await this.logsService.create(creator.email, 'CREA_DESARROLLO');
    return saved;
  }

  async createMany(createDesarrolloDtos: CreateDesarrolloDto[], creator: CreatorInfo) {
    const desarrollos = this.desarrolloRepository.create(
      createDesarrolloDtos.map((dto) => ({
        ...dto,
        createdByUserId: creator.userId,
        createdByEmail: creator.email,
      })),
    );
    const saved = await this.desarrolloRepository.save(desarrollos);
    await this.logsService.create(creator.email, `CREA_DESARROLLO_BULK:${saved.length}`);
=======
  async create(createDesarrolloDto: CreateDesarrolloDto, actor: string, userId: number) {
    const desarrollo = this.desarrolloRepository.create({
      ...createDesarrolloDto,
      createdByUserId: userId,
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
        createdByUserId: userId,
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
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
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
