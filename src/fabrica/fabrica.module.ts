import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';
import { FabricaController } from './fabrica.controller';
import { Fabrica } from './fabrica.entity';
import { FabricaService } from './fabrica.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fabrica]), LogsModule],
  controllers: [FabricaController],
  providers: [FabricaService],
})
export class FabricaModule {}
