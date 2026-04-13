import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Desarrollo } from '../desarrollo/desarrollo.entity';
import { Fabrica } from '../fabrica/fabrica.entity';
import { Licencia } from '../licencias/licencia.entity';
import { Log } from '../logs/log.entity';
import { User } from '../users/user.entity';

export function buildTypeOrmOptions(env: NodeJS.ProcessEnv): TypeOrmModuleOptions {
  const isCloudSqlUnixSocket = (env.DB_HOST ?? '').startsWith('/cloudsql/');
  const useSsl =
    !isCloudSqlUnixSocket && (env.DB_SSL ?? 'true') === 'true';
  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: Number(env.DB_PORT ?? 5432),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    entities: [User, Desarrollo, Fabrica, Licencia, Log],
    synchronize: false,
  };
}
