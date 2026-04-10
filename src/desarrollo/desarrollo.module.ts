import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from '../logs/logs.module';
import { DesarrolloController } from './desarrollo.controller';
import { Desarrollo } from './desarrollo.entity';
import { DesarrolloService } from './desarrollo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Desarrollo]), LogsModule],
  controllers: [DesarrolloController],
  providers: [DesarrolloService],
})
export class DesarrolloModule {}
