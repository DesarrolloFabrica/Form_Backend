import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('fabrica', 'desarrollo')`);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "name" character varying(120) NOT NULL,
        "email" character varying(160) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "development_requests" (
        "id" SERIAL NOT NULL,
        "project_name" character varying(180) NOT NULL,
        "request_date" date NOT NULL,
        "delivery_date" date NOT NULL,
        "requester" character varying(160) NOT NULL,
        "status" character varying(120) NOT NULL,
        "notes" text,
        CONSTRAINT "PK_development_requests_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "factory_requests" (
        "id" SERIAL NOT NULL,
        "request_type" character varying(120) NOT NULL,
        "module_count" integer NOT NULL,
        "granule_count" integer NOT NULL,
        "materials" text NOT NULL,
        "material_count" integer NOT NULL,
        "work_order_request_date" date NOT NULL,
        "requester" character varying(160) NOT NULL,
        "delivery_date" date NOT NULL,
        "input_delivery" character varying(160),
        "input_link" text,
        "package_type" character varying(120) NOT NULL,
        "request_channel" character varying(120) NOT NULL,
        "status" character varying(120) NOT NULL,
        "progress_type" character varying(120) NOT NULL,
        "school" character varying(120) NOT NULL,
        "program" character varying(120) NOT NULL,
        "learning_mode" character varying(120) NOT NULL,
        "subject_count" integer NOT NULL,
        CONSTRAINT "PK_factory_requests_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "licenses" (
        "id" SERIAL NOT NULL,
        "license_name" character varying(160) NOT NULL,
        "linked_email" character varying(160) NOT NULL,
        "purchase_date" date NOT NULL,
        "end_date" date NOT NULL,
        "license_type" character varying(120) NOT NULL,
        "coordination" character varying(160) NOT NULL,
        "cost" numeric(12,2) NOT NULL,
        "currency" character varying(12) NOT NULL,
        CONSTRAINT "PK_licenses_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL,
        "actor" character varying(160) NOT NULL,
        "event_type" character varying(160) NOT NULL,
        CONSTRAINT "PK_activity_logs_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activity_logs"`);
    await queryRunner.query(`DROP TABLE "licenses"`);
    await queryRunner.query(`DROP TABLE "factory_requests"`);
    await queryRunner.query(`DROP TABLE "development_requests"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
