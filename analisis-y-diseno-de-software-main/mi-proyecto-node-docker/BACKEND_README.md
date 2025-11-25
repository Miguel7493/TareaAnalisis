# 🏦 UsmBank (Aurora Privé) - Backend API REST

## 📋 Índice

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Migraciones](#migraciones)
- [Ejecución](#ejecución)
- [Endpoints de API](#endpoints-de-api)
- [Autenticación](#autenticación)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Testing](#testing)

---

## 📖 Descripción

Backend completo en Node.js con Express y PostgreSQL para sistema bancario UsmBank. Implementa API REST con autenticación JWT, gestión de créditos, simulaciones y más.

**Características:**
- ✅ API REST completa
- ✅ Autenticación JWT
- ✅ Arquitectura en capas (Repositorio → Servicio → Controlador → Rutas)
- ✅ Base de datos PostgreSQL con migraciones
- ✅ Validación de datos
- ✅ Manejo centralizado de errores
- ✅ Logging de requests
- ✅ CORS configurado
- ✅ Sistema de amortización francés
- ✅ Datos de prueba (seeds)

---

## 🏗️ Arquitectura

```
src/
├── config/           # Configuración (BD, JWT)
├── repositories/     # Capa de acceso a datos
├── services/         # Lógica de negocio
├── controllers/      # Handlers de requests
├── routes/           # Definición de rutas
├── middleware/       # Middleware custom (auth, errores)
└── utils/            # Utilidades (validadores, calculadora)

migrations/           # Scripts SQL de migración
seeds/                # Datos de prueba
scripts/              # Scripts de utilidad
```

**Patrón:** Arquitectura en capas con separación de responsabilidades

```
Request → Routes → Middleware → Controller → Service → Repository → PostgreSQL
                                    ↓
                                Response
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
cd analisis-y-diseno-de-software-main/mi-proyecto-node-docker
```

### 2. Instalar dependencias

```bash
npm install
```

**Dependencias principales:**
- `express` - Framework web
- `pg` - Driver PostgreSQL
- `bcrypt` - Hash de passwords
- `jsonwebtoken` - Autenticación JWT
- `cors` - CORS middleware

---

## ⚙️ Configuración

### Variables de Entorno

El sistema usa las siguientes variables (con valores por defecto):

```bash
# Base de datos
DB_HOST=postgres_db
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=mydb

# JWT
JWT_SECRET=usmbank-aurora-prive-secret-key-2024-change-in-production
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANTE:** En producción, cambiar `JWT_SECRET` por una clave segura.

### Docker Compose

El proyecto incluye `docker-compose.yml` configurado:

```yaml
services:
  app:         # Aplicación Node.js
  postgres_db: # Base de datos PostgreSQL 15
```

---

## 🗄️ Migraciones

### Iniciar contenedores Docker

```bash
docker-compose up -d
```

### Ejecutar migraciones y seeds

```bash
# Migrar esquema + insertar datos de prueba
npm run migrate

# Solo migrar esquema (sin datos de prueba)
npm run migrate:no-seeds
```

### ¿Qué hacen las migraciones?

**Esquema (`001_create_schema.sql`):**
- ✅ Crea 7 tablas principales
- ✅ Define 6 tipos ENUM
- ✅ Configura índices y constraints
- ✅ Crea triggers para updated_at
- ✅ Genera vistas útiles
- ✅ Función para generar números de cuenta

**Tablas creadas:**
1. `usuarios` - Autenticación y datos básicos
2. `clientes` - Perfil financiero
3. `creditos` - Solicitudes de crédito
4. `cuotas` - Tabla de amortización
5. `simulaciones` - Historial de simulaciones
6. `cuentas_bancarias` - Cuentas de clientes
7. `transacciones` - Movimientos bancarios

**Seeds (`001_seed_data.sql`):**
- ✅ 3 usuarios de prueba (Regular, Premium, VIP)
- ✅ 4 cuentas bancarias
- ✅ 4 créditos (diferentes estados)
- ✅ Cuotas de amortización
- ✅ Transacciones de ejemplo

### Usuarios de Prueba

| Email | Password | Tipo | RUT |
|-------|----------|------|-----|
| juan.perez@email.com | Password123! | REGULAR | 12345678-9 |
| maria.gonzalez@email.com | Premium2024! | PREMIUM | 23456789-0 |
| carlos.silva@email.com | VIP2024Secure! | VIP | 34567890-1 |

---

## ▶️ Ejecución

### Desarrollo

```bash
# Iniciar servidor
npm start

# O con nodemon (si está instalado)
npm run dev
```

**Servidor:** http://localhost:3000

**Salida esperada:**

```
🚀 Iniciando UsmBank API Server...

📊 Probando conexión a base de datos...
✅ Conexión a base de datos exitosa
📅 Server time: 2025-11-24T...
🐘 PostgreSQL version: PostgreSQL 15...

✅ Servidor iniciado exitosamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Servidor:        http://localhost:3000
🔌 API:             http://localhost:3000/api
💚 Health Check:    http://localhost:3000/api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Verificar que funciona

```bash
curl http://localhost:3000/api/health
```

**Respuesta esperada:**

```json
{
  "status": "OK",
  "timestamp": "2025-11-24T...",
  "uptime": 123.456,
  "service": "UsmBank API",
  "version": "1.0.0"
}
```

---

## 🔌 Endpoints de API

### Health & Info

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check del servidor |
| GET | `/api` | Información de la API |

### Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Registrar nuevo usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/auth/profile` | Sí | Obtener perfil |
| PUT | `/api/auth/change-password` | Sí | Cambiar contraseña |
| POST | `/api/auth/verify-token` | Sí | Verificar token |

### Simulaciones

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/simulaciones` | Opcional | Simular crédito |
| GET | `/api/simulaciones` | Sí | Historial de simulaciones |

### Créditos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/creditos` | Sí | Solicitar crédito |
| GET | `/api/creditos` | Sí | Listar créditos |
| GET | `/api/creditos/:id` | Sí | Detalle de crédito |
| GET | `/api/creditos/estadisticas` | Sí | Estadísticas del cliente |

### Administración (Demo)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/creditos/:id/aprobar` | Aprobar crédito |
| POST | `/api/creditos/:id/desembolsar` | Desembolsar crédito |
| POST | `/api/creditos/:id/rechazar` | Rechazar crédito |

---

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. **Registro:** `POST /api/auth/register` → Devuelve token
2. **Login:** `POST /api/auth/login` → Devuelve token
3. **Usar token:** Incluir en header `Authorization: Bearer <token>`

### Header de Autorización

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Expiración

Los tokens expiran en **24 horas** por defecto.

---

## 📚 Ejemplos de Uso

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@email.com",
    "password": "Secure123!",
    "nombre": "Usuario",
    "apellido": "Nuevo",
    "rut": "11111111-1",
    "telefono": "+56912345678"
  }'
```

**Respuesta:**

```json
{
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id": "uuid...",
      "email": "nuevo@email.com",
      "nombre": "Usuario",
      "apellido": "Nuevo"
    },
    "cliente": {
      "id": "uuid...",
      "rut": "11111111-1",
      "tipo": "REGULAR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@email.com",
    "password": "Password123!"
  }'
```

**Respuesta:**

```json
{
  "message": "Login exitoso",
  "data": {
    "usuario": {
      "id": "11111111-1111-1111-1111-111111111111",
      "email": "juan.perez@email.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "clienteId": "22222222-2222-2222-2222-222222222222",
      "rut": "12345678-9",
      "tipoCliente": "REGULAR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Simular Crédito (Sin autenticación)

```bash
curl -X POST http://localhost:3000/api/simulaciones \
  -H "Content-Type: application/json" \
  -d '{
    "monto": 10000000,
    "tasaInteres": 4.5,
    "plazoMeses": 36
  }'
```

**Respuesta:**

```json
{
  "message": "Simulación calculada exitosamente",
  "data": {
    "id": "uuid...",
    "monto": 10000000,
    "tasaInteres": 4.5,
    "plazoMeses": 36,
    "cuotaMensual": 295842.25,
    "totalPagar": 10650321,
    "interesTotal": 650321,
    "fechaSimulacion": "2025-11-24T..."
  }
}
```

### 4. Solicitar Crédito (Con autenticación)

```bash
curl -X POST http://localhost:3000/api/creditos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "monto": 5000000,
    "tasaInteres": 4.5,
    "plazoMeses": 36,
    "tipo": "CONSUMO",
    "notas": "Para remodelación de casa"
  }'
```

**Respuesta:**

```json
{
  "message": "Solicitud de crédito creada exitosamente",
  "data": {
    "id": "uuid...",
    "monto": 5000000,
    "tasaInteres": 4.5,
    "plazoMeses": 36,
    "tipo": "CONSUMO",
    "estado": "PENDIENTE",
    "fechaSolicitud": "2025-11-24T..."
  }
}
```

### 5. Listar Créditos del Cliente

```bash
curl -X GET http://localhost:3000/api/creditos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": "uuid...",
      "monto_solicitado": 5000000,
      "monto_aprobado": 5000000,
      "tasa_interes": 4.5,
      "plazo_meses": 36,
      "cuota_mensual": 147916.67,
      "total_pagar": 5325000,
      "tipo": "CONSUMO",
      "estado": "DESEMBOLSADO",
      "fecha_solicitud": "2025-11-24T...",
      "total_cuotas": 36,
      "cuotas_pagadas": 2,
      "cuotas_mora": 0
    }
  ]
}
```

### 6. Obtener Detalle de Crédito con Tabla de Amortización

```bash
curl -X GET http://localhost:3000/api/creditos/UUID_DEL_CREDITO \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Respuesta:**

```json
{
  "data": {
    "credito": {
      "id": "uuid...",
      "montoSolicitado": 5000000,
      "montoAprobado": 5000000,
      "tasaInteres": 4.5,
      "plazoMeses": 36,
      "cuotaMensual": 147916.67,
      "totalPagar": 5325000,
      "tipo": "CONSUMO",
      "estado": "DESEMBOLSADO"
    },
    "resumenCuotas": {
      "total_cuotas": 36,
      "cuotas_pagadas": 2,
      "cuotas_pendientes": 34,
      "cuotas_mora": 0,
      "monto_pagado": 295833.34,
      "monto_pendiente": 5029166.66,
      "total_mora": 0
    },
    "cuotas": [
      {
        "numeroCuota": 1,
        "montoCuota": 147916.67,
        "capital": 129166.67,
        "interes": 18750.00,
        "saldoPendiente": 4870833.33,
        "fechaVencimiento": "2025-12-24",
        "fechaPago": "2025-12-20T...",
        "estado": "PAGADA"
      },
      {
        "numeroCuota": 2,
        "montoCuota": 147916.67,
        "capital": 129650.52,
        "interes": 18266.15,
        "saldoPendiente": 4741182.81,
        "fechaVencimiento": "2026-01-24",
        "estado": "PENDIENTE"
      }
      // ... 34 cuotas más
    ]
  }
}
```

### 7. Obtener Estadísticas del Cliente

```bash
curl -X GET http://localhost:3000/api/creditos/estadisticas \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Respuesta:**

```json
{
  "data": {
    "creditos": {
      "total_creditos": 3,
      "aprobados": 1,
      "rechazados": 0,
      "desembolsados": 2,
      "monto_total": 20000000,
      "tasa_promedio": 4.2
    },
    "deuda": {
      "creditos_activos": 2,
      "cuota_mensual_total": 488541.67,
      "deuda_total": 17560000,
      "cuotas_en_mora": 0
    }
  }
}
```

### 8. Aprobar Crédito (Admin)

```bash
curl -X POST http://localhost:3000/api/creditos/UUID_DEL_CREDITO/aprobar \
  -H "Content-Type: application/json" \
  -d '{
    "montoAprobado": 5000000
  }'
```

### 9. Desembolsar Crédito (Genera tabla de amortización)

```bash
curl -X POST http://localhost:3000/api/creditos/UUID_DEL_CREDITO/desembolsar \
  -H "Content-Type: application/json"
```

**Respuesta:** Incluye tabla de amortización completa con todas las cuotas.

---

## 🧪 Testing Manual

### Flujo Completo de Prueba

```bash
# 1. Registrar usuario
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test123!",
    "nombre": "Test",
    "apellido": "User",
    "rut": "99999999-9",
    "telefono": "+56999999999"
  }' | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Simular crédito
curl -X POST http://localhost:3000/api/simulaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "monto": 3000000,
    "tasaInteres": 5.0,
    "plazoMeses": 24
  }'

# 3. Solicitar crédito
CREDITO_ID=$(curl -s -X POST http://localhost:3000/api/creditos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "monto": 3000000,
    "tasaInteres": 5.0,
    "plazoMeses": 24,
    "tipo": "CONSUMO"
  }' | jq -r '.data.id')

echo "Crédito ID: $CREDITO_ID"

# 4. Aprobar crédito
curl -X POST http://localhost:3000/api/creditos/$CREDITO_ID/aprobar

# 5. Desembolsar (genera cuotas)
curl -X POST http://localhost:3000/api/creditos/$CREDITO_ID/desembolsar

# 6. Ver detalle con tabla de amortización
curl -X GET http://localhost:3000/api/creditos/$CREDITO_ID \
  -H "Authorization: Bearer $TOKEN"

# 7. Ver estadísticas
curl -X GET http://localhost:3000/api/creditos/estadisticas \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Seguridad

### Implementado

✅ **Passwords hasheados** con bcrypt (10 rounds)
✅ **JWT tokens** con expiración
✅ **Validación de inputs** en todos los endpoints
✅ **Sanitización** de strings
✅ **Rate limiting** de intentos de login (5 intentos)
✅ **Bloqueo temporal** de cuentas (15 minutos)
✅ **CORS** configurado
✅ **SQL injection** prevenido (prepared statements)
✅ **Error handling** sin exponer detalles sensibles

### Recomendaciones para Producción

🔴 Cambiar `JWT_SECRET` a valor seguro aleatorio
🔴 Usar HTTPS (TLS/SSL)
🔴 Implementar rate limiting global
🔴 Agregar helmet.js para security headers
🔴 Implementar logging con Winston
🔴 Configurar variables de entorno con dotenv
🔴 Usar Redis para sesiones y cache
🔴 Implementar monitoring (Sentry, New Relic)

---

## 📊 Estructura de la Base de Datos

### Diagrama ER (Simplificado)

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│ usuarios │───1:1─│ clientes │───1:N─│ creditos │
└──────────┘       └──────────┘       └────┬─────┘
                        │                   │
                      1:N                  1:N
                        │                   │
                   ┌────▼────┐         ┌───▼──────┐
                   │ cuentas │         │  cuotas  │
                   │bancarias│         └──────────┘
                   └────┬────┘
                        │
                       1:N
                        │
                   ┌────▼────────┐
                   │transacciones│
                   └─────────────┘
```

### Índices Importantes

- `usuarios.email` (UNIQUE, índice)
- `clientes.rut` (UNIQUE, índice)
- `clientes.score_credito` (índice para búsquedas rápidas)
- `creditos.estado` (índice para filtros)
- `cuotas.estado` y `fecha_vencimiento` (índices para alertas de mora)

---

## 🐛 Troubleshooting

### Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
docker ps

# Ver logs del contenedor
docker logs mi-proyecto-node-docker-postgres_db-1

# Reiniciar contenedor
docker-compose restart postgres_db
```

### Migraciones fallan

```bash
# Conectarse manualmente a PostgreSQL
docker exec -it mi-proyecto-node-docker-postgres_db-1 psql -U user -d mydb

# Verificar tablas existentes
\dt

# Borrar todas las tablas (¡CUIDADO!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Volver a ejecutar migraciones
npm run migrate
```

### Token inválido

- Verificar que el token no haya expirado (24h)
- Verificar formato del header: `Authorization: Bearer <token>`
- Verificar que `JWT_SECRET` no haya cambiado

### Error 500 en endpoints

- Verificar logs del servidor
- Verificar que las migraciones se ejecutaron
- Verificar conexión a base de datos

---

## 📝 Próximos Pasos (Roadmap)

### Corto Plazo
- [ ] Implementar pago de cuotas
- [ ] Notificaciones de vencimiento
- [ ] Cálculo automático de mora
- [ ] Dashboard administrativo

### Mediano Plazo
- [ ] Integración con pasarela de pagos
- [ ] Generación de PDFs (contratos, estados de cuenta)
- [ ] Sistema de notificaciones (email, SMS)
- [ ] Chat de soporte

### Largo Plazo
- [ ] App móvil
- [ ] Análisis de riesgo con ML
- [ ] Open Banking integration
- [ ] Microservicios

---

## 📞 Soporte

**Documentación:** Este archivo
**Issues:** GitHub Issues
**Email:** soporte@usmbank.cl

---

## 📄 Licencia

MIT License - UsmBank (Aurora Privé) © 2024

---

**Desarrollado con ❤️ por el equipo de UsmBank**
