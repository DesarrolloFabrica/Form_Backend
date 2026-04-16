import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToRequests1710000002000 implements MigrationInterface {
  name = 'AddCreatedByToRequests1710000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      ADD COLUMN IF NOT EXISTS "created_by_user_id" integer,
      ADD COLUMN IF NOT EXISTS "created_by_email" varchar(160);
    `);

    await queryRunner.query(`
      ALTER TABLE "development_requests"
      ADD COLUMN IF NOT EXISTS "created_by_user_id" integer,
      ADD COLUMN IF NOT EXISTS "created_by_email" varchar(160);
    `);

    await queryRunner.query(`
      ALTER TABLE "licenses"
      ADD COLUMN IF NOT EXISTS "created_by_user_id" integer,
      ADD COLUMN IF NOT EXISTS "created_by_email" varchar(160);
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_factory_requests_created_by_user_id'
        ) THEN
          ALTER TABLE "factory_requests"
          ADD CONSTRAINT "fk_factory_requests_created_by_user_id"
          FOREIGN KEY ("created_by_user_id")
          REFERENCES "users"("id")
          ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_development_requests_created_by_user_id'
        ) THEN
          ALTER TABLE "development_requests"
          ADD CONSTRAINT "fk_development_requests_created_by_user_id"
          FOREIGN KEY ("created_by_user_id")
          REFERENCES "users"("id")
          ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_licenses_created_by_user_id'
        ) THEN
          ALTER TABLE "licenses"
          ADD CONSTRAINT "fk_licenses_created_by_user_id"
          FOREIGN KEY ("created_by_user_id")
          REFERENCES "users"("id")
          ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "licenses"
      DROP CONSTRAINT IF EXISTS "fk_licenses_created_by_user_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "development_requests"
      DROP CONSTRAINT IF EXISTS "fk_development_requests_created_by_user_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      DROP CONSTRAINT IF EXISTS "fk_factory_requests_created_by_user_id";
    `);

    await queryRunner.query(`
      ALTER TABLE "licenses"
      DROP COLUMN IF EXISTS "created_by_email",
      DROP COLUMN IF EXISTS "created_by_user_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "development_requests"
      DROP COLUMN IF EXISTS "created_by_email",
      DROP COLUMN IF EXISTS "created_by_user_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "factory_requests"
      DROP COLUMN IF EXISTS "created_by_email",
      DROP COLUMN IF EXISTS "created_by_user_id";
    `);
  }
}
