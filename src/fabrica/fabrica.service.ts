import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateFabricaDto } from './dto/create-fabrica.dto';
import { Fabrica } from './fabrica.entity';

@Injectable()
export class FabricaService {
  constructor(
    @InjectRepository(Fabrica)
    private readonly fabricaRepository: Repository<Fabrica>,
    private readonly logsService: LogsService,
  ) {}

  async create(createFabricaDto: CreateFabricaDto, actor: string, userId: number) {
    const fabrica = this.fabricaRepository.create({
      ...createFabricaDto,
      createdByUserId: userId,
    });
    const saved = await this.fabricaRepository.save(fabrica);
    await this.logsService.create(actor, 'CREA_FABRICA', {
      userId,
      targetTable: 'factory_requests',
      targetId: saved.id,
      payload: createFabricaDto as unknown as Record<string, unknown>,
    });
    return saved;
  }

  async createMany(createFabricaDtos: CreateFabricaDto[], actor: string, userId: number) {
    const fabricas = this.fabricaRepository.create(
      createFabricaDtos.map((fabrica) => ({
        ...fabrica,
        createdByUserId: userId,
      })),
    );
    const saved = await this.fabricaRepository.save(fabricas);
    await this.logsService.create(actor, `CREA_FABRICA_BULK:${saved.length}`, {
      userId,
      targetTable: 'factory_requests',
      payload: {
        count: saved.length,
        ids: saved.map((fabrica) => fabrica.id),
      },
    });
    return saved;
  }

  findAll() {
    return this.fabricaRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
