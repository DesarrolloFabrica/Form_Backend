import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeFactoryDeliveryDateNullable1710000003000 implements MigrationInterface {
  name = 'MakeFactoryDeliveryDateNullable1710000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      ALTER COLUMN "delivery_date" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      ALTER COLUMN "delivery_date" SET NOT NULL
    `);
  }
}
