# Guía de Ejecución y Sustentación para la Prueba Técnica

Este documento es tu **hoja de ruta táctica** para el día de la evaluación. Recopila los fundamentos teóricos, el flujo de trabajo minuto a minuto, las recetas rápidas para conectar cualquier tecnología que pidan (ORM, Auth, CQRS, Microservicios) y el guion de sustentación alineado con la rúbrica de 100 puntos.

> **Nota importante sobre la Rúbrica (Documentación - 20 pts):**
> La rúbrica exige explícitamente: *"README funcional y escrito en inglés... comentarios explicativos en inglés... Con documentación Swagger estructurada de forma profesional en inglés"*. Por ello, todo el código en `src/`, los decoradores de Swagger y el archivo `README.md` principal ya están redactados en inglés técnico profesional.

---

## 1. Rutina de Ejecución Rápida el Día de la Prueba

### Paso 1: Levantar Base de Datos con Docker (1 Minuto)
Según la base de datos que te pidan en el enunciado, ejecuta uno de estos comandos (ya están configurados en `docker-compose.yml` mediante `profiles`):

```bash
# Si piden PostgreSQL:
docker compose --profile postgres up -d

# Si piden MySQL:
docker compose --profile mysql up -d

# Si piden MongoDB:
docker compose --profile mongo up -d

# Si piden Redis (Caché / Colas / Microservicios):
docker compose --profile redis up -d
```

### Paso 2: Instalar el Stack Específico de la Prueba (2 Minutos)

#### Opción A: TypeORM + PostgreSQL (El más común en NestJS)
```bash
npm install @nestjs/typeorm typeorm pg
```
Descomenta el bloque `TypeOrmModule.forRootAsync(...)` que ya está listo en `src/app.module.ts`.

#### Opción B: Prisma ORM
```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

#### Opción C: Autenticación con JWT (`@nestjs/jwt`)
```bash
npm install @nestjs/jwt bcrypt
npm install -D @types/bcrypt
```
Y en `src/common/guards/jwt-auth.guard.ts` inyectas `JwtService` en el punto de extensión marcado.

#### Opción D: Autenticación con Better Auth
```bash
npm install better-auth
```
En `src/common/guards/jwt-auth.guard.ts` usas `auth.api.getSession({ headers: request.headers })`.

#### Opción E: CQRS o API Gateway / Microservicios
```bash
# Para CQRS:
npm install @nestjs/cqrs

# Para API Gateway / Microservicios:
npm install @nestjs/microservices
```

### Paso 3: Generar Módulos Funcionales (Segundos)
Para cada entidad del dominio (ej. `users`, `orders`, `products`), usa la CLI de NestJS o duplica `src/modules/_template`:

```bash
npx nest g resource modules/users --no-spec
```
1. Modela la entidad en `entities/*.entity.ts` (agrega índices `@Index()` en columnas de búsqueda frecuente y relaciones claras para ganar los **20 puntos en Persistencia e Integridad de Datos**).
2. Copia las validaciones y `@ApiProperty()` desde `src/modules/_template/dto/create-item.dto.ts`.
3. Usa `PaginationQueryDto` (`@common/dto/pagination-query.dto`) en tus métodos `findAll` para ganar los **20 puntos en Optimización de Consultas**.

---

## 2. Checklist para Obtener 100/100 en la Rúbrica

| Criterio (20 pts c/u) | Qué ya incluye este Boilerplate | Qué debes cuidar durante la prueba |
| :--- | :--- | :--- |
| **1. Estructura del código y buenas prácticas** | Arquitectura Modular (*Package by Feature*), separación en 3 capas, alias `@common/*` y `@modules/*`, tipado estricto, comentarios en inglés. | Mantén los controladores delgados (solo delegan al servicio) y divide métodos largos en funciones privadas con nombres descriptivos. |
| **2. Persistencia e integridad de datos** | Contenedores listos con volúmenes persistentes y variables de entorno tipadas. | Agrega `@Index()` en llaves foráneas/búsquedas (`email`, `status`, `createdAt`), usa `unique: true` donde corresponda y maneja restricciones de integridad (`ConflictException` en duplicados). |
| **3. Funcionalidad y validaciones** | `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`, `Helmet`, `CORS`, `HttpExceptionFilter` global, `ResponseInterceptor` global y `PaginationQueryDto`. | Valida cada DTO con `class-validator` (`@IsString`, `@IsEmail`, `@IsUUID`, `@Min`, etc.) y protege las rutas privadas con `JwtAuthGuard`. |
| **4. Sustentación** | Argumentación sólida basada en **YAGNI**, alta cohesión local y desacoplamiento progresivo. | Explica el flujo de datos paso a paso (Pipe -> Guard -> Controller -> Service -> Repository -> Interceptor/Filter). |
| **5. Documentación** | `README.md` profesional en inglés, Swagger configurado en `/docs` con soporte Bearer Auth y comentarios JSDoc en inglés. | Decora cada endpoint nuevo con `@ApiTags`, `@ApiOperation` y `@ApiProperty` en inglés. |

---

## 3. Guion de Sustentación (Entrevista)

### En Español (Para entrevista oral en español)
> *"Para la realización de esta prueba técnica prioricé el **pragmatismo, la alta cohesión y la velocidad de entrega**, adoptando una **Arquitectura Modular por Funcionalidad (Package by Feature)** apoyada en las capacidades nativas de NestJS.*
>
> *Cada funcionalidad de negocio está organizada en un módulo autocontenido dentro de `src/modules/` que agrupa sus propios controladores, servicios, DTOs y entidades. Se eligió una estructura interna de 3 capas directas junto con recursos transversales globales en `src/common/` (filtros de excepciones, interceptores de respuesta, pipes de validación y guardias de autenticación) para evitar la sobreingeniería de crear mappers e interfaces de repositorios innecesarias en un dominio de alcance acotado, aplicando el principio **YAGNI (You Aren't Gonna Need It)**.*
>
> *Esta decisión garantiza un código altamente legible, fácil de probar y preparado para evolucionar hacia patrones más complejos (como CQRS, Monolito Modular o Microservicios) únicamente si la complejidad del dominio de negocio lo llegara a requerir."*

### En Inglés (Por si parte de la evaluación o README es en inglés)
> *"For this technical assessment, I prioritized **pragmatism, high local cohesion, and delivery velocity** by adopting a **Package by Feature (Modular Architecture)** built around NestJS's native module system.*
>
> *Each business domain lives in a self-contained module under `src/modules/` encapsulating its controllers, services, DTOs, and entities, supported by global cross-cutting concerns in `src/common/` (standardized exception filters, response interceptors, strict validation pipes, and authentication guards). Following the **YAGNI** principle, I chose a direct 3-layer internal design to avoid premature boilerplate, while keeping module boundaries clean so any feature can scale independently into CQRS or Microservices when required."*

