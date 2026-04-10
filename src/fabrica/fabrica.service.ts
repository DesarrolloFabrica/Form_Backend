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

  async create(createFabricaDto: CreateFabricaDto, actor: string) {
    const fabrica = this.fabricaRepository.create(createFabricaDto);
    const saved = await this.fabricaRepository.save(fabrica);
    await this.logsService.create(actor, 'CREA_FABRICA');
    return saved;
  }

  async createMany(createFabricaDtos: CreateFabricaDto[], actor: string) {
    const fabricas = this.fabricaRepository.create(createFabricaDtos);
    const saved = await this.fabricaRepository.save(fabricas);
    await this.logsService.create(actor, `CREA_FABRICA_BULK:${saved.length}`);
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
