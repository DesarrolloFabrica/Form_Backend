import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSpanishSchemaToEnglish1710000001000 implements MigrationInterface {
  name = 'RenameSpanishSchemaToEnglish1710000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='usuarios') THEN
          ALTER TABLE "usuarios" RENAME TO "users";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='nombre') THEN
          ALTER TABLE "users" RENAME COLUMN "nombre" TO "name";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='correo') THEN
          ALTER TABLE "users" RENAME COLUMN "correo" TO "email";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='contrasena') THEN
          ALTER TABLE "users" RENAME COLUMN "contrasena" TO "password_hash";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='rol') THEN
          ALTER TABLE "users" RENAME COLUMN "rol" TO "role";
        END IF;
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='UQ_usuarios_correo') THEN
          ALTER TABLE "users" RENAME CONSTRAINT "UQ_usuarios_correo" TO "UQ_users_email";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname='usuarios_rol_enum') THEN
          ALTER TYPE "public"."usuarios_rol_enum" RENAME TO "users_role_enum";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='desarrollo') THEN
          ALTER TABLE "desarrollo" RENAME TO "development_requests";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='development_requests' AND column_name='nombre_proyecto') THEN
          ALTER TABLE "development_requests" RENAME COLUMN "nombre_proyecto" TO "project_name";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='development_requests' AND column_name='fecha_solicitud') THEN
          ALTER TABLE "development_requests" RENAME COLUMN "fecha_solicitud" TO "request_date";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='development_requests' AND column_name='fecha_entrega') THEN
          ALTER TABLE "development_requests" RENAME COLUMN "fecha_entrega" TO "delivery_date";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='development_requests' AND column_name='solicitante') THEN
          ALTER TABLE "development_requests" RENAME COLUMN "solicitante" TO "requester";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='development_requests' AND column_name='estado') THEN
          ALTER TABLE "development_requests" RENAME COLUMN "estado" TO "status";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='development_requests' AND column_name='observaciones') THEN
          ALTER TABLE "development_requests" RENAME COLUMN "observaciones" TO "notes";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='fabrica') THEN
          ALTER TABLE "fabrica" RENAME TO "factory_requests";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='tipo_requisicion') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "tipo_requisicion" TO "request_type";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='cantidad_modulos') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "cantidad_modulos" TO "module_count";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='cantidad_granulos') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "cantidad_granulos" TO "granule_count";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='materiales') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "materiales" TO "materials";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='cantidad_materiales') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "cantidad_materiales" TO "material_count";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='fecha_solicitud_ot') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "fecha_solicitud_ot" TO "work_order_request_date";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='solicitante') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "solicitante" TO "requester";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='fecha_entrega') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "fecha_entrega" TO "delivery_date";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='entrega_insumo') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "entrega_insumo" TO "input_delivery";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='enlace_insumo') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "enlace_insumo" TO "input_link";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='tipo_paquete') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "tipo_paquete" TO "package_type";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='canal_solicitud') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "canal_solicitud" TO "request_channel";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='estado') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "estado" TO "status";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='tipo_progreso') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "tipo_progreso" TO "progress_type";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='escuela') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "escuela" TO "school";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='programa') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "programa" TO "program";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='modalidad') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "modalidad" TO "learning_mode";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='factory_requests' AND column_name='cantidad_materias') THEN
          ALTER TABLE "factory_requests" RENAME COLUMN "cantidad_materias" TO "subject_count";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='licencias') THEN
          ALTER TABLE "licencias" RENAME TO "licenses";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='nombre_licencias') THEN
          ALTER TABLE "licenses" RENAME COLUMN "nombre_licencias" TO "license_name";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='correo_vinculado') THEN
          ALTER TABLE "licenses" RENAME COLUMN "correo_vinculado" TO "linked_email";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='fecha_compra') THEN
          ALTER TABLE "licenses" RENAME COLUMN "fecha_compra" TO "purchase_date";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='fecha_finalizacion') THEN
          ALTER TABLE "licenses" RENAME COLUMN "fecha_finalizacion" TO "end_date";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='tipo_licencia') THEN
          ALTER TABLE "licenses" RENAME COLUMN "tipo_licencia" TO "license_type";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='coordinacion') THEN
          ALTER TABLE "licenses" RENAME COLUMN "coordinacion" TO "coordination";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='costo') THEN
          ALTER TABLE "licenses" RENAME COLUMN "costo" TO "cost";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='licenses' AND column_name='moneda') THEN
          ALTER TABLE "licenses" RENAME COLUMN "moneda" TO "currency";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='logs') THEN
          ALTER TABLE "logs" RENAME TO "activity_logs";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_logs' AND column_name='fecha_ingreso') THEN
          ALTER TABLE "activity_logs" RENAME COLUMN "fecha_ingreso" TO "created_at";
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_logs' AND column_name='tipo') THEN
          ALTER TABLE "activity_logs" RENAME COLUMN "tipo" TO "event_type";
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE IF EXISTS "activity_logs" RENAME COLUMN "event_type" TO "tipo"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "activity_logs" RENAME COLUMN "created_at" TO "fecha_ingreso"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "activity_logs" RENAME TO "logs"`);

    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "currency" TO "moneda"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "cost" TO "costo"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "coordination" TO "coordinacion"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "license_type" TO "tipo_licencia"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "end_date" TO "fecha_finalizacion"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "purchase_date" TO "fecha_compra"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "linked_email" TO "correo_vinculado"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME COLUMN "license_name" TO "nombre_licencias"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "licenses" RENAME TO "licencias"`);

    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "subject_count" TO "cantidad_materias"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "learning_mode" TO "modalidad"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "program" TO "programa"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "school" TO "escuela"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "progress_type" TO "tipo_progreso"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "status" TO "estado"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "request_channel" TO "canal_solicitud"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "package_type" TO "tipo_paquete"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "input_link" TO "enlace_insumo"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "input_delivery" TO "entrega_insumo"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "delivery_date" TO "fecha_entrega"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "requester" TO "solicitante"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "work_order_request_date" TO "fecha_solicitud_ot"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "material_count" TO "cantidad_materiales"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "materials" TO "materiales"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "granule_count" TO "cantidad_granulos"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "module_count" TO "cantidad_modulos"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME COLUMN "request_type" TO "tipo_requisicion"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "factory_requests" RENAME TO "fabrica"`);

    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME COLUMN "notes" TO "observaciones"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME COLUMN "status" TO "estado"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME COLUMN "requester" TO "solicitante"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME COLUMN "delivery_date" TO "fecha_entrega"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME COLUMN "request_date" TO "fecha_solicitud"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME COLUMN "project_name" TO "nombre_proyecto"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "development_requests" RENAME TO "desarrollo"`);

    await queryRunner.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='users_role_enum') THEN ALTER TYPE "public"."users_role_enum" RENAME TO "usuarios_rol_enum"; END IF; END $$;`);

    await queryRunner.query(`ALTER TABLE IF EXISTS "users" RENAME CONSTRAINT "UQ_users_email" TO "UQ_usuarios_correo"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "users" RENAME COLUMN "role" TO "rol"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "users" RENAME COLUMN "password_hash" TO "contrasena"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "users" RENAME COLUMN "email" TO "correo"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "users" RENAME COLUMN "name" TO "nombre"`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "users" RENAME TO "usuarios"`);
  }
}
