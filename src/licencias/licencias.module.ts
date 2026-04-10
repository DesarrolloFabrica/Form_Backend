import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';
import { Licencia } from './licencia.entity';
import { LicenciasController } from './licencias.controller';
import { LicenciasService } from './licencias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Licencia]), LogsModule],
  controllers: [LicenciasController],
  providers: [LicenciasService],
})
export class LicenciasModule {}
