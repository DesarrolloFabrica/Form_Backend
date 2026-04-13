import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { CreateFabricaDto } from './dto/create-fabrica.dto';
import { Fabrica } from './fabrica.entity';

interface CreatorInfo {
  userId: number;
  email: string;
}

@Injectable()
export class FabricaService {
  constructor(
    @InjectRepository(Fabrica)
    private readonly fabricaRepository: Repository<Fabrica>,
    private readonly logsService: LogsService,
  ) {}

<<<<<<< HEAD
  async create(createFabricaDto: CreateFabricaDto, creator: CreatorInfo) {
    const fabrica = this.fabricaRepository.create({
      ...createFabricaDto,
      createdByUserId: creator.userId,
      createdByEmail: creator.email,
    });
    const saved = await this.fabricaRepository.save(fabrica);
    await this.logsService.create(creator.email, 'CREA_FABRICA');
    return saved;
  }

  async createMany(createFabricaDtos: CreateFabricaDto[], creator: CreatorInfo) {
    const fabricas = this.fabricaRepository.create(
      createFabricaDtos.map((dto) => ({
        ...dto,
        createdByUserId: creator.userId,
        createdByEmail: creator.email,
      })),
    );
    const saved = await this.fabricaRepository.save(fabricas);
    await this.logsService.create(creator.email, `CREA_FABRICA_BULK:${saved.length}`);
=======
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
>>>>>>> c054de65574d98dbf938b4ca344090ad2c8f0c0c
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
