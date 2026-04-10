import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Desarrollo } from '../desarrollo/desarrollo.entity';
import { Fabrica } from '../fabrica/fabrica.entity';
import { Licencia } from '../licencias/licencia.entity';
import { Log } from '../logs/log.entity';
import { User } from '../users/user.entity';

export default new DataSource({
  // Cloud PostgreSQL suele requerir SSL.
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: (process.env.DB_SSL ?? 'true') === 'true' ? { rejectUnauthorized: false } : false,
  entities: [User, Desarrollo, Fabrica, Licencia, Log],
  migrations: ['src/migrations/*.ts'],
});
