import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('fabrica', 'desarrollo')`);
    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id" SERIAL NOT NULL,
        "nombre" character varying(120) NOT NULL,
        "correo" character varying(160) NOT NULL,
        "contrasena" character varying(255) NOT NULL,
        "rol" "public"."usuarios_rol_enum" NOT NULL,
        CONSTRAINT "UQ_usuarios_correo" UNIQUE ("correo"),
        CONSTRAINT "PK_usuarios_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "desarrollo" (
        "id" SERIAL NOT NULL,
        "nombre_proyecto" character varying(180) NOT NULL,
        "fecha_solicitud" date NOT NULL,
        "fecha_entrega" date NOT NULL,
        "solicitante" character varying(160) NOT NULL,
        "estado" character varying(120) NOT NULL,
        "observaciones" text,
        CONSTRAINT "PK_desarrollo_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "fabrica" (
        "id" SERIAL NOT NULL,
        "tipo_requisicion" character varying(120) NOT NULL,
        "cantidad_modulos" integer NOT NULL,
        "cantidad_granulos" integer NOT NULL,
        "materiales" text NOT NULL,
        "cantidad_materiales" integer NOT NULL,
        "fecha_solicitud_ot" date NOT NULL,
        "solicitante" character varying(160) NOT NULL,
        "fecha_entrega" date NOT NULL,
        "entrega_insumo" character varying(160),
        "enlace_insumo" text,
        "tipo_paquete" character varying(120) NOT NULL,
        "canal_solicitud" character varying(120) NOT NULL,
        "estado" character varying(120) NOT NULL,
        "tipo_progreso" character varying(120) NOT NULL,
        "escuela" character varying(120) NOT NULL,
        "programa" character varying(120) NOT NULL,
        "modalidad" character varying(120) NOT NULL,
        "cantidad_materias" integer NOT NULL,
        CONSTRAINT "PK_fabrica_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "licencias" (
        "id" SERIAL NOT NULL,
        "nombre_licencias" character varying(160) NOT NULL,
        "correo_vinculado" character varying(160) NOT NULL,
        "fecha_compra" date NOT NULL,
        "fecha_finalizacion" date NOT NULL,
        "tipo_licencia" character varying(120) NOT NULL,
        "coordinacion" character varying(160) NOT NULL,
        "costo" numeric(12,2) NOT NULL,
        "moneda" character varying(12) NOT NULL,
        CONSTRAINT "PK_licencias_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "logs" (
        "id" SERIAL NOT NULL,
        "fecha_ingreso" TIMESTAMP NOT NULL,
        "actor" character varying(160) NOT NULL,
        "tipo" character varying(160) NOT NULL,
        CONSTRAINT "PK_logs_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TABLE "licencias"`);
    await queryRunner.query(`DROP TABLE "fabrica"`);
    await queryRunner.query(`DROP TABLE "desarrollo"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
  }
}
