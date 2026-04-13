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
