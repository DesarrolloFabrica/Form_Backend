import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  create(actor: string, tipo: string) {
    const log = this.logRepository.create({
      actor,
      tipo,
      fechaIngreso: new Date(),
    });
    return this.logRepository.save(log);
  }

  findAll() {
    return this.logRepository.find({
      order: {
        fechaIngreso: 'DESC',
      },
    });
  }
}
