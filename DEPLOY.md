# Despliegue en Google Cloud Run (it-fab-contenido-edu-4)

Backend **NestJS** + **TypeORM** + **PostgreSQL**. La imagen escucha en `process.env.PORT` (Cloud Run lo inyecta; por defecto en local se usa `8080`).

## Prerrequisitos

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (`gcloud` y `docker` o compilación solo con Cloud Build).
- Permisos en el proyecto: Cloud Run Admin, Cloud Build Editor, Artifact Registry Admin, Secret Manager Admin (o equivalentes para tu rol).

## Variables de entorno en Cloud Run

| Variable       | Valor recomendado |
|----------------|-------------------|
| `DB_HOST`      | `/cloudsql/it-fab-contenido-edu-4:us-central1:inventario-fab` |
| `DB_PORT`      | `5432` |
| `DB_NAME`      | Nombre de tu base de datos |
| `DB_USER`      | Usuario de PostgreSQL |
| `DB_PASSWORD`  | Desde Secret Manager (ver abajo) |
| `DB_SSL`       | `false` (conexión por socket Unix) |
| `NODE_ENV`     | `production` |
| `JWT_SECRET`   | Secreto fuerte (variable o secreto) |
| `CORS_ORIGIN`  | URL(s) del frontend, separadas por coma si hay varias |

`PORT` lo define Cloud Run automáticamente; no hace falta fijarlo a mano.

---

## Pasos en terminal

Sustituye `REGION`, `SERVICE`, `REPO` e `IMAGE` si quieres otros nombres. Ejemplo: `REGION=us-central1`, `SERVICE=form-backend`, `REPO=backends`, `IMAGE=form-backend`.

### 1. Autenticación y proyecto

```bash
gcloud auth login
gcloud config set project it-fab-contenido-edu-4
```

### 2. APIs necesarias

```bash
gcloud services enable run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com
```

### 3. Artifact Registry (si no existe el repositorio)

```bash
export REGION=us-central1
export REPO=backends

gcloud artifacts repositories describe "$REPO" \
  --location="$REGION" \
  --format='value(name)' 2>/dev/null || \
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Imágenes Docker para backends"
```

### 4. Secreto para la contraseña de la base de datos

Crea el secreto (te pedirá el valor de forma segura) o impórtalo desde un archivo:

```bash
echo -n "TU_PASSWORD_POSTGRES" | gcloud secrets create DB_PASSWORD \
  --data-file=- \
  --replication-policy=automatic
```

Si el secreto ya existe y quieres una nueva versión:

```bash
echo -n "TU_PASSWORD_POSTGRES" | gcloud secrets versions add DB_PASSWORD --data-file=-
```

Concede a la cuenta de servicio de Cloud Run el acceso al secreto (sustituye `PROJECT_NUMBER` y `SERVICE_ACCOUNT` si usas una Cuenta de Servicio personalizada; por defecto Cloud Run usa la Cuenta de Servicio del proyecto):

```bash
export PROJECT_ID=it-fab-contenido-edu-4
export PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding DB_PASSWORD \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Si tu servicio de Cloud Run usa otra cuenta de servicio, repite `add-iam-policy-binding` con `--member=serviceAccount:TU_SA@...`.

### 5. Construir la imagen con Cloud Build

Desde la raíz del repositorio (donde está el `Dockerfile`):

```bash
export REGION=us-central1
export REPO=backends
export IMAGE=form-backend
export TAG=$(date +%Y%m%d-%H%M%S)

gcloud builds submit \
  --tag "${REGION}-docker.pkg.dev/it-fab-contenido-edu-4/${REPO}/${IMAGE}:${TAG}" \
  .
```

Anota la URI de la imagen generada (`...docker.pkg.dev/...`).

### 6. Desplegar en Cloud Run con Cloud SQL y variables

```bash
export REGION=us-central1
export SERVICE=form-backend
export REPO=backends
export IMAGE=form-backend
export TAG=...   # mismo tag que en el build

gcloud run deploy "$SERVICE" \
  --image="${REGION}-docker.pkg.dev/it-fab-contenido-edu-4/${REPO}/${IMAGE}:${TAG}" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=it-fab-contenido-edu-4:us-central1:inventario-fab \
  --set-env-vars=NODE_ENV=production,DB_HOST=/cloudsql/it-fab-contenido-edu-4:us-central1:inventario-fab,DB_PORT=5432,DB_NAME=TU_DATABASE,DB_USER=TU_USUARIO,DB_SSL=false,JWT_SECRET=TU_JWT_SECRET_FUERTE,CORS_ORIGIN=https://tu-dominio-frontend.com \
  --set-secrets=DB_PASSWORD=DB_PASSWORD:latest
```

**Notas:**

- Sustituye `TU_DATABASE`, `TU_USUARIO`, `TU_JWT_SECRET_FUERTE` y la URL de `CORS_ORIGIN`.
- Para `JWT_SECRET` y `DB_PASSWORD` es preferible usar Secret Manager también, por ejemplo: `--set-secrets=DB_PASSWORD=DB_PASSWORD:latest,JWT_SECRET=JWT_SECRET:latest`.
- Si necesitas más variables, sepáralas por coma en `--set-env-vars` o usa un archivo `--env-vars-file=vars.yaml`.

### 7. Comprobar salud

Tras el despliegue, Cloud Run mostrará la URL del servicio:

```bash
curl -sS "https://TU_URL_DE_CLOUD_RUN/health"
```

Debe responder `{"ok":true}`.

Las rutas de API siguen bajo el prefijo global `/api` (por ejemplo `/api/auth/...`).

---

## Migraciones TypeORM

Las migraciones se ejecutan con `npm run migration:run` apuntando a la misma instancia (por ejemplo desde Cloud Build, Cloud Run Job o tu máquina con acceso a Cloud SQL). No forman parte del arranque del contenedor por defecto.

---

## Problemas frecuentes

- **Cloud SQL / permisos**: el servicio de Cloud Run necesita el rol **Cloud SQL Client** en la cuenta de servicio que ejecuta el revision.
- **CORS**: si el frontend no es `localhost`, define `CORS_ORIGIN` con el origen exacto (esquema + host + puerto si aplica).
- **Contraseña con caracteres especiales**: usa Secret Manager; evita pegar la contraseña en texto plano en el historial de terminal cuando sea posible.
