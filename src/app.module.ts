import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DesarrolloModule } from './desarrollo/desarrollo.module';
import { FabricaModule } from './fabrica/fabrica.module';
import { LicenciasModule } from './licencias/licencias.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { buildTypeOrmOptions } from './config/typeorm.config';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmOptions({
          DB_HOST: configService.get<string>('DB_HOST'),
          DB_PORT: configService.get<string>('DB_PORT'),
          DB_USER: configService.get<string>('DB_USER'),
          DB_PASSWORD: configService.get<string>('DB_PASSWORD'),
          DB_NAME: configService.get<string>('DB_NAME'),
          DB_SSL: configService.get<string>('DB_SSL'),
        }),
    }),
    AuthModule,
    UsersModule,
    DesarrolloModule,
    FabricaModule,
    LicenciasModule,
    LogsModule,
  ],
})
export class AppModule {}
