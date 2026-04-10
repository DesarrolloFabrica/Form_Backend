# Form Backend (NestJS)

Backend NestJS para gestionar formularios de `fabrica`, `desarrollo` y `licencias` con autenticacion JWT y control de roles.

## Requisitos

- Node.js 20+
- PostgreSQL

## Instalacion

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y completa valores.

Variables usadas:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRES_IN_SECONDS`

## Migraciones

```bash
npm run migration:run
```

Revertir ultima migracion:

```bash
npm run migration:revert
```

## Ejecucion

```bash
npm run start:dev
```

## Autenticacion y roles

- Roles permitidos: `fabrica`, `desarrollo`.
- `POST /api/auth/register` crea usuarios.
- `POST /api/auth/login` retorna token JWT.
- En rutas protegidas enviar: `Authorization: Bearer <token>`.

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Desarrollo (solo rol `desarrollo`)

- `POST /api/desarrollo`
- `GET /api/desarrollo`

### Fabrica (solo rol `fabrica`)

- `POST /api/fabrica`
- `GET /api/fabrica`

### Licencias (roles `fabrica` y `desarrollo`)

- `POST /api/licencias`
- `GET /api/licencias`

### Logs (roles `fabrica` y `desarrollo`)

- `GET /api/logs`

## Registros de auditoria

Se inserta un registro en la tabla `logs` cuando:

- Un usuario inicia sesion (`LOGIN_EXITOSO`)
- Se crea un formulario de `desarrollo` (`CREA_DESARROLLO`)
- Se crea un formulario de `fabrica` (`CREA_FABRICA`)
- Se crea un formulario de `licencias` (`CREA_LICENCIA`)
