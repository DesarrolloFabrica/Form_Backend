import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWhoAuditFields1710000002000 implements MigrationInterface {
  name = 'AddWhoAuditFields1710000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "development_requests"
      ADD COLUMN IF NOT EXISTS "created_by_user_id" integer
    `);
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      ADD COLUMN IF NOT EXISTS "created_by_user_id" integer
    `);
    await queryRunner.query(`
      ALTER TABLE "licenses"
      ADD COLUMN IF NOT EXISTS "created_by_user_id" integer
    `);

    await queryRunner.query(`
      ALTER TABLE "activity_logs"
      ADD COLUMN IF NOT EXISTS "user_id" integer
    `);
    await queryRunner.query(`
      ALTER TABLE "activity_logs"
      ADD COLUMN IF NOT EXISTS "target_table" character varying(80)
    `);
    await queryRunner.query(`
      ALTER TABLE "activity_logs"
      ADD COLUMN IF NOT EXISTS "target_id" integer
    `);
    await queryRunner.query(`
      ALTER TABLE "activity_logs"
      ADD COLUMN IF NOT EXISTS "payload" jsonb
    `);

    await queryRunner.query(`
      ALTER TABLE "development_requests"
      ADD CONSTRAINT "FK_development_requests_created_by_user"
      FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      ADD CONSTRAINT "FK_factory_requests_created_by_user"
      FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "licenses"
      ADD CONSTRAINT "FK_licenses_created_by_user"
      FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "activity_logs"
      ADD CONSTRAINT "FK_activity_logs_user"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT IF EXISTS "FK_activity_logs_user"`);
    await queryRunner.query(`ALTER TABLE "licenses" DROP CONSTRAINT IF EXISTS "FK_licenses_created_by_user"`);
    await queryRunner.query(`ALTER TABLE "factory_requests" DROP CONSTRAINT IF EXISTS "FK_factory_requests_created_by_user"`);
    await queryRunner.query(`ALTER TABLE "development_requests" DROP CONSTRAINT IF EXISTS "FK_development_requests_created_by_user"`);

    await queryRunner.query(`ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "payload"`);
    await queryRunner.query(`ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "target_id"`);
    await queryRunner.query(`ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "target_table"`);
    await queryRunner.query(`ALTER TABLE "activity_logs" DROP COLUMN IF EXISTS "user_id"`);

    await queryRunner.query(`ALTER TABLE "licenses" DROP COLUMN IF EXISTS "created_by_user_id"`);
    await queryRunner.query(`ALTER TABLE "factory_requests" DROP COLUMN IF EXISTS "created_by_user_id"`);
    await queryRunner.query(`ALTER TABLE "development_requests" DROP COLUMN IF EXISTS "created_by_user_id"`);
  }
}
